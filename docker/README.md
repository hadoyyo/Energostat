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
* Reset container `docker-compose down -v && docker-compose up`
* Stop container `docker stop <container-name>`, or just `CTRL + C`

---
## Start one service

* To start only MySQL container use `docker-compose up mysql`

---

_Should work_ ( ͡° ͜ʖ ͡°)