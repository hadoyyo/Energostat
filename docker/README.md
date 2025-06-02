# How to start docker containers

Make sure docker and sql deamons are up. Idk about windows so figure it out <3

---

## If you don't have connection in MySQL

I don't know if it is necessary but create new connection first.

## Create connection

* Connection name: (e.g. energostat)
* Connection method: Standard __TCP/IP__
* Hostname: __127.0.0.1__
* Port: __3307__
* Username: root
* Password: (check .env)

The same data is used establishing connection on server side.

---
## Start containers

* Build and start containers, both __mysql-db__ and __node-app__ `docker-compose up --build`
* Reset container `docker-compose down -v && docker-compose up -d`
* Stop container `docker stop mysql-db`, or just `CTRL + C`

---

_Should work_ ( ͡° ͜ʖ ͡°)