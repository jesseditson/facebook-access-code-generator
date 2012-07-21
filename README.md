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

####Running on Heroku:

Heroku doesn't like the runtime.json setup of config, so we'll need to save it to an environment variable.

First, create a file called `heroku.json` in the config folder with the info you'd like to run on heroku. Most likely this will be the same as your `package.json`.

Then, to update the config, run: 

        node ./configLoader.js save heroku

To make things easier, you probably want to add a git post-commit hook to do this for you when you commit:

Here's what that would look like:

        #!/bin/bash
        
        if [ $GIT_DIR ]
          then
          cd $GIT_DIR/..
        fi
        
        node ./configLoader.js save heroku

####Bonus:

- If you're behind a proxy, you can add a `port` key to your runtime.json to set the port it'll run on.

- You can change the permissions requested by setting the `facebook.scope` key to a comma separated string, like `user_status,offline_access,publish_stream`