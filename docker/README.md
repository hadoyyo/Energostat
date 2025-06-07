# How to start docker containers

Make sure docker and sql daemons are up. Idk about windows so figure it out <3


## Create connection

It is not necessary but makes debugging easier.

* Connection name: (e.g. energostat)
* Connection method: Standard __TCP/IP__
* Hostname: __127.0.0.1__
* Port: __3307__
* Username: root
* Password: (check .env)

## Start whole service

The best solution so far is to manually start containers in right order, which is: __mysql -> server -> client__.

_Make sure that previous action is finished before starting the next service. For example test if you can connect to DB using MySQL Workbench before starting server._

* Start __mysql__ `docker-composer up mysql`
* Start __server__ `docker-composer up server`
* Start __client__ `docker-compose up client`

Database is saved by default if you want to have a clean start use `docker-compose down -v` before starting __mysql__.

---