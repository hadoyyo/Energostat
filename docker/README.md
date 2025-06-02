# Start MySQL

Make sure docker and sql deamons are up. Idk about windows so figure it out <3

---

## Create connection

* Connection name: (e.g. energostat)
* Connection method: Standard __TCP/IP__
* Hostname: __127.0.0.1__
* Port: __3307__
* Username: root
* Password: (check .env)

---
## Start container

* Start docker compose `docker-compose up -d`
* If you want more info to debug or something use `docker-compose up --build`
* Reset container `docker-compose down -v && docker-compose up -d`
* Stop container `docker stop mysql-db`

---

_Should work_ ( ͡° ͜ʖ ͡°)