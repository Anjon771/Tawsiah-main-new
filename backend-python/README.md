## 🛠️ do not proceed with these steps if you do not know what your doing.

---

# as of current last update on engine here is the correct way to launch it and make it ready for test file:

---
1. open docker app on your pc
2. type "docker compose up qdrant" in git bash in order to power up the database
3. go into your browser at "http://localhost:6333/dashboard" and delete all existing collections
4. fire up the engine using "python -m uvicorn app.main:app --reload" and wait for engine to run
5. you can safely run tests and get recommendations

*note: if u want to change preference use the variable "prefs"