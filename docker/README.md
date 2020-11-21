# The docker way to do it

## Installation and Updating

All the following methods require you to clone the LuckPermsWeb repository onto your device and to ``cd`` into it.

### Using docker-compose

First open the docker-compose.yml file in your favourite text editor and replace the environment variables with your own settings, you can find a explaination for the enviroment variables [here](#environment-variables).

Now you just need to type ``docker-compose up -d`` which will automatically create a bytebin and LuckPermsWeb container. The bytebin service will be exposed on port ``7665`` and the LuckPermsWeb service will be exposed on port ``7666``.

**__Updating__**
```sh
docker-compose down
docker pull luckperms/bytebin:latest
docker pull luckperms/luckpermsweb:latest
docker-compose up -d
```

### Using plain docker

```sh
docker run -d --name bytebin -p 7665:7665 luckperms/bytebin:latest
docker run -d --name luckpermsweb -p 7666:7666 -e BYTEBIN_URL="<public url of your bytebin service" luckperms/luckpermsweb:latest
```

**__Updating__**
```sh
docker rm -f luckpermsweb
docker rm -f bytebin
docker pull luckperms/bytebin:latest
docker pull luckperms/luckpermsweb:latest
docker run -d --name bytebin -p 7665:7665 luckperms/bytebin:latest
docker run -d --name luckpermsweb -p 7666:7666 -e BYTEBIN_URL="<public url of your bytebin service" luckperms/luckpermsweb:latest
```

### Manually build and run the containers

If you con't want to use the hosted version of the containers and rather want full controll over what is on your device/server, you can alternatively build the containers yourself. In order for LPWeb to work correctly you will also need a bytebin instance, or just use the one at https://bytebin.lucko.me/ (Skip building bytebin then).

#### Bytebin

```sh
git clone https://github.com/lucko/bytebin
cd bytebin
docker build . -t bytebin:latest
docker run -d --name bytebin -p 7665:7665 bytebin:latest
```

#### LuckPerms web

```sh
docker build . -t luckpermsweb:latest
docker run -d --name luckpermsweb -p 7666:7666 -e BYTEBIN_URL="<public url of your bytebin service" luckpermsweb:latest
```

## Environment variables

Setting up the containers is being done trough environment variables, below you can find a explaination on every avaiable variable. To add it to a container you just need to add ``-e <env variable>="<value>"`` to your docker command before the container type ( e.g. ``luckpermsweb:latest``)

``<ENVIROMENT VARIABLE>=<DEFAULT VALUE> - <EXPLAINATION>``

### LuckPerms Web

```
BYTEBIN_URL="https://bytebin.lucko.me/" - Holds the url of the bytebin service
BASE_DIRECTORY="/" - Base directory under which LuckPermsWeb will be under
```

### Bytebin

```
BYTEBIN_KEYLEN=10 - The length of the unique identifier for each bytebin entry
BYTEBIN_LIFETIME=10080 - The lifetime of bytebin entries
BYTEBIN_CONTENTLEN=10 - The maximum size of a bytebin entry in megabytes
```

## Why docker?

Docker is a great and easy way to ship out applications within a few seconds, since all dependencies and a working environment gets shipped with your containers without the bloatiness of VirtualMachines. This makes docker as easy as plug-and-play, because with one command you can deploy the application and everything thats necessary for it to work.