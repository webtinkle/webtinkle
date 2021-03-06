# WebTinkle
NGINX configuration generator tool

> /!\ Currently, WebTinkle is in an early stage and must not be used in production /!\

## Install
WebTinkle depends on NodeJS 6.4.0 or later and can be installed with npm (generally bundled with NodeJS) using this command:
```bash
npm i -g webtinkle
```

## How to use

### Templates
The most important part of WebTinkle is templating. Templates allows to make an NGINX configuration adapted to the needs.
WebTinkle doesn't contains any templates himself, but provides a command to download templates, the [`webtinkle install`](https://github.com/webtinkle/webtinkle/wiki/Command:-webtinkle-install) command:
```bash
webtinkle install <templateName>
```
It will download the specified template from [this GitHub repository](https://github.com/webtinkle/webtinkle-templates) and install those automatically.

If you want to remove an installed template, use [`webtinkle uninstall`](https://github.com/webtinkle/webtinkle/wiki/Command:-webtinkle-uninstall)  command:
```bash
webtinkle uninstall <templateName>
```

### Website

To add a website to NGINX configs, use the [`webtinkle add`](https://github.com/webtinkle/webtinkle/wiki/Command:-webtinkle-add) command:
```bash
webtinkle add <domain> -t <templateName>
```

To remove a website from NGINX configs, use the [`webtinkle remove`](https://github.com/webtinkle/webtinkle/wiki/Command:-webtinkle-remove) command:
```bash
webtinkle remove <domain>
```


## Troubleshooting
### nginx.configFolder must point to a directory
It means that your NGINX configuration path is not a valid folder.
nginx.configFolder must point to a path where he would be able to put the NGINX configurations.
In most computers, this folder is located at `/etc/nginx/conf.d/`, but sometimes, it must point to a different folder.

To change the location where WebTinkle put its configurations, you must do the command:
```
webtinkle config nginx.configFolder <yourPath>
```



## Contribute
### Getting Started
First, WebTinkle requires yarn to handle its dependencies, so make sure you have it to avoid trouble.

To start, you need to clone the repository. When you've done this, install all dependencies using the command below:
```bash
yarn
```
It should load all dependencies. After that you can contribute.


### Build Project
Gulp must be used to build WebTinkle so be sure to have it. When you have it, depending of the wanted build kind, execute the following commands.
#### Developement Build
Developement build are builds made to be built faster and to provide more informations to developers.
```bash
gulp dev
```
#### Production Build
Production build are build made to be more optimized for a publication.
```bash
gulp prod
```

### Execute Commands
WebTinkle provides a script to test the commands, to use it, instead of using `webtinkle` at the start of your commands, use the following:
```bash
yarn cli ...
```

For example, `webtinkle install proxy` becomes `yarn cli install proxy`.

### Show Logs
WebTinkle has a command option named `--loglevel`, or simply `-L`. It can be used to provide more or less logs depending of the selected level.
```
webtinkle [command] -L <level>
```

The available log levels are enumerated below. You can use their name or their level id as argument. Logs with lower or equal levels than the choosen log level will be printed in the console.
* error (0)
* warn (1)
* info (2)
* verbose (3)
* debug (4)
* silly (5)

