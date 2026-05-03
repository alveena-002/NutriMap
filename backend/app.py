"""
NutriMap API — proxies Hugging Face Inference API with deterministic mock fallbacks.
Set HF_TOKEN (optional but recommended for rate limits): https://huggingface.co/settings/tokens
"""

from __future__ import annotations

import os
from typing import Any

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

HF_TOKEN = os.getenv("HF_TOKEN", "").strip()
HF_HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}
HF_TIMEOUT = 25


def _hf_post(model: str, payload: dict[str, Any]) -> dict[str, Any] | list[Any] | None:
    url = f"https://api-inference.huggingface.co/models/{model}"
    try:
        r = requests.post(url, headers=HF_HEADERS, json=payload, timeout=HF_TIMEOUT)
        if not r.ok:
            return None
        data = r.json()
        return data if isinstance(data, (dict, list)) else None
    except requests.RequestException:
        return None


def mock_zero_shot(sequence: str) -> dict[str, Any]:
    s = sequence.lower()
    if any(k in s for k in ["which area", "where", "map", "zone", "most need"]):
        label = "geographic_prioritization"
        score = 0.87
    elif any(k in s for k in ["cheap", "meal", "budget", "eat", "protein"]):
        label = "nutrition_optimization"
        score = 0.81
    elif len(sequence) > 240:
        label = "long_form_brief"
        score = 0.74
    else:
        label = "general_policy"
        score = 0.66
    return {"labels": [label, "other"], "scores": [score, 1 - score], "sequence": sequence[:500]}


def mock_classify(sequence: str) -> dict[str, Any]:
    text = sequence.lower()
    urgent = any(w in text for w in ["urgent", "famine", "collapse", "emergency"])
    polarity = [{"label": "NEGATIVE", "score": 0.82}] if urgent else [{"label": "POSITIVE", "score": 0.61}]
    return polarity


def mock_summarize(sequence: str) -> dict[str, Any]:
    snip = sequence.strip().replace("\n", " ")
    if len(snip) > 320:
        snip = snip[:297] + " …"
    return [{"summary_text": f"Executive brief: prioritize cash+ kitchens in Sindh/Balochistan corridors. Anchor: {snip}"}]


def classify_urgency_label(hf_payload: list[Any] | None) -> str:
    if not hf_payload or not isinstance(hf_payload, list):
        return "neutral"
    first = hf_payload[0]
    if not isinstance(first, dict):
        return "neutral"
    lab = str(first.get("label", "")).upper()
    if lab == "NEGATIVE":
        return "elevated_watch"
    if lab == "POSITIVE":
        return "steady_state"
    return "neutral"


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "hf_token_configured": bool(HF_TOKEN)})


@app.post("/api/ai/zero-shot")
def zero_shot_route():
    body = request.get_json(force=True, silent=True) or {}
    sequence = str(body.get("sequence") or "").strip()
    labels = body.get("candidate_labels")
    if not sequence:
        return jsonify({"error": "sequence required"}), 400
    candidates = labels if isinstance(labels, list) and labels else ["policy", "logistics", "nutrition"]

    data = _hf_post(
        "facebook/bart-large-mnli",
        {"inputs": sequence, "parameters": {"candidate_labels": candidates}},
    )

    mock = mock_zero_shot(sequence)
    if isinstance(data, dict) and data.get("labels"):
        best = {"label": data["labels"][0], "score": float(data["scores"][0]) if data.get("scores") else None}
        return jsonify({"source": "huggingface", "result": best, "raw": data})
    top = mock["labels"][0]
    return jsonify({"source": "mock", "result": {"label": top, "score": mock["scores"][0]}, "raw": mock})


@app.post("/api/ai/classify")
def classify_route():
    body = request.get_json(force=True, silent=True) or {}
    sequence = str(body.get("sequence") or body.get("text") or "").strip()
    if not sequence:
        return jsonify({"error": "sequence or text required"}), 400

    data = _hf_post("distilbert-base-uncased-finetuned-sst-2-english", {"inputs": sequence})

    polarity = mock_classify(sequence)
    if isinstance(data, list) and data and isinstance(data[0], dict) and data[0].get("label"):
        return jsonify({"source": "huggingface", "urgency_hint": classify_urgency_label(data), "raw": data})
    return jsonify({"source": "mock", "urgency_hint": classify_urgency_label(polarity), "raw": polarity})


@app.post("/api/ai/summarize")
def summarize_route():
    body = request.get_json(force=True, silent=True) or {}
    sequence = str(body.get("sequence") or body.get("text") or "").strip()
    if not sequence:
        return jsonify({"error": "sequence or text required"}), 400

    cap = sequence[:2800]
    data = _hf_post(
        "facebook/bart-large-cnn",
        {
            "inputs": cap,
            "parameters": {"max_length": 160, "min_length": 32, "do_sample": False},
        },
    )

    mocked = mock_summarize(cap)
    if isinstance(data, list) and data and isinstance(data[0], dict) and data[0].get("summary_text"):
        return jsonify({"source": "huggingface", "summary": data[0]["summary_text"], "raw": data})

    summary = mocked[0]["summary_text"]
    return jsonify({"source": "mock", "summary": summary, "raw": mocked})


@app.post("/api/assistant")
def assistant():
    """Orchestrate zero-shot + classification + conditional summarization for chat UX."""
    body = request.get_json(force=True, silent=True) or {}
    message = str(body.get("message") or "").strip()
    if not message:
        return jsonify({"error": "message required"}), 400

    candidates = ["geographic", "nutrition", "logistics", "general"]
    zs_hf = _hf_post(
        "facebook/bart-large-mnli",
        {"inputs": message, "parameters": {"candidate_labels": candidates}},
    )
    zs_mock = mock_zero_shot(message)
    zs = None
    if isinstance(zs_hf, dict) and zs_hf.get("labels"):
        zs_label = str(zs_hf["labels"][0])
        zs_conf = float(zs_hf["scores"][0]) if zs_hf.get("scores") else zs_mock["scores"][0]
        zs = {"source": "huggingface", "result": {"label": zs_label, "score": zs_conf}, "raw": zs_hf}
    else:
        zs_label = zs_mock["labels"][0]
        zs_conf = zs_mock["scores"][0]
        zs = {"source": "mock", "result": {"label": zs_label, "score": zs_conf}, "raw": zs_mock}

    clf_mock = mock_classify(message)
    clf_source: dict[str, Any] = {
        "source": "mock",
        "urgency_hint": classify_urgency_label(clf_mock),
        "raw": clf_mock,
    }
    clf_hf = _hf_post("distilbert-base-uncased-finetuned-sst-2-english", {"inputs": message[:512]})
    if isinstance(clf_hf, list) and clf_hf:
        clf_source = {
            "source": "huggingface",
            "urgency_hint": classify_urgency_label(clf_hf),
            "raw": clf_hf,
        }

    summary_snip = None
    if len(message) > 220:
        sum_res = mock_summarize(message)
        hf_sum = _hf_post(
            "facebook/bart-large-cnn",
            {
                "inputs": message[:2000],
                "parameters": {"max_length": 140, "min_length": 28, "do_sample": False},
            },
        )
        if isinstance(hf_sum, list) and hf_sum and isinstance(hf_sum[0], dict):
            summary_snip = hf_sum[0].get("summary_text")
        if not summary_snip:
            summary_snip = sum_res[0]["summary_text"]

    lines = []

    lines.append(f"Intent cluster · {zs_label} (~{zs_conf:.0%} routing confidence)")
    urg = clf_source["urgency_hint"]
    tone = {
        "elevated_watch": "Escalate with rapid response cells.",
        "steady_state": "Maintain steady provisioning.",
        "neutral": "Monitor routine indicators.",
    }[urg]
    lines.append(f"Sentiment sentinel · {urg.replace('_', ' ')} — {tone}")

    if "nutrition" in zs_label.lower() or any(k in message.lower() for k in ["cheap", "meal", "budget", "recipe"]):
        lines.append(
            "Nutrition playbook: prioritize masoor+roti combos, fortified oil programs, egg-distribution where cold chain absent."
        )

    if "geographic" in zs_label.lower() or any(k in message.lower() for k in ["where", "area", "province", "map"]):
        lines.append(
            "Geo triage snapshot: elevate South Balochistan + interior Sindh; pair cash transfers at wholesale chokepoints."
        )

    if summary_snip:
        lines.append(f"Compressed brief: {summary_snip}")

    lines.append("")
    lines.append(
        "Models: bart-large-mnli · distilbert-sst2 · bart-large-cnn — mock layers engage if inference is cold or rate-limited."
    )

    meta = {
        "zero_shot": zs,
        "classify": clf_source,
        "mock_only": zs.get("source") == "mock",
    }

    return jsonify({"reply": "\n".join(lines), "meta": meta})

@app.get("/")
def index():
    return jsonify({"message": "NutriMap API is running!", "status": "ok"})
    
if __name__ == "__main__":
    port = int(os.getenv("PORT", "8080"))
    app.run(host="0.0.0.0", port=port, debug=False)
