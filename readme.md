# Newman Reporter Json Latency Summary

This Newman reporter generates an artifact containing failures, total response times, aggregate response times for each iteration, and individual request response times.

---

Install:

To use, run the command

npm i -g newman-reporter-json-latency-summary

---

Usage:

newman run path/to/collection.json \
-e path/to/environment.json \
-d path/to/iteration-data.csv \
-r json-latency-summary,cli \
--reporter-json-latency-summary-export path/to/report.json

---

Based on the https://www.npmjs.com/package/newman-reporter-json-summary package.
