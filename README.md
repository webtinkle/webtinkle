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
WebTinkle doesn't contains any templates himself, but provides a command to download templates, the `webtinkle install` command:
```bash
webtinkle install <templateName>
```
It will download the specified template from [this GitHub repository](https://github.com/webtinkle/webtinkle-templates) and install those automatically.

If you want to remove an installed template, use `webtinkle uninstall` command:
```bash
webtinkle uninstall <templateName>
```

### Website

To add a website to NGINX configs, use the `webtinkle add` command:
```bash
webtinkle add <domain> -t <templateName>
```

To remove a website from NGINX configs, use the `webtinkle remove` command:
```bash
webtinkle remove <domain>
```


## Troubleshooting
### nginx.configPath must point to a directory
It means that your NGINX configuration path is not a valid folder.
nginx.configPath must point to a path where he would be able to put the NGINX configurations.
In most computers, this folder is located at `/etc/nginx/conf.d/`, but sometimes, it must point to a different folder.

To change the location where WebTinkle put its configurations, you must do the command:
```
webtinkle config nginx.configPath <yourPath>
```



## Contribute
### Getting Started
First, WebTinkle requires yarn to handle its dependencies, so make sure you have it to avoid trouble.

To start, you need to clone the repository. When you've done this, install all dependencies using the command below:
```bash
yarn
```
It should load all dependencies. After that you can contribute.


### Execute Commands
WebTinkle provides a script to test the commands, to use it, instead of using `webtinkle` at the start of your commands, use the following:
```bash
yarn cli ...
```

For example, `webtinkle install proxy` becomes `yarn cli install proxy`.