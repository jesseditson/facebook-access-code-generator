##Facebook access token generator

####Usage:

1. `npm install .`

2. add a file called `runtime.json` to the `config` dir with this info:

    { 
      "facebook" : {
        "appid" : "YOUR-APP-ID",
        "appsecret" : "YOUR-APP-SECRET"
      }
    }

3. add a hostname to your `etc/hosts` file that has points your fb app url to 127.0.0.1:

    sudo echo "127.0.0.1 your.app.url" >> /etc/hosts

4. `sudo node access_code_generator.js`

5. Visit your.app.url in a browser