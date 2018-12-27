# WebTinkle
NGINX configuration generator tool

> /!\ Currently, WebTinkle is in an early stage and must not be used in production /!\

## Install
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

To change the location where WebTinkle put his configurations, you must do the command:
```
webtinkle config nginx.configPath <yourPath>
```