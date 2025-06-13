# How to start docker containers

Make sure docker daemon is up. Idk about windows so figure it out <3

## Create connection

It is not necessary but makes debugging easier.

* Connection name: (e.g. energostat)
* Connection method: Standard __TCP/IP__
* Hostname: __127.0.0.1__
* Port: __3306__
* Username: root
* Password: (check .env)

## Start service

* Goated command `docker-compose up -d --build`
* Start __mysql__ `docker-composer up mysql`
* Start __server__ `docker-composer up server`
* Start __client__ `docker-compose up client`

## Stop service

* To stop whole service use `docker-compose down`
* Clean everything `docker-compose down -v`