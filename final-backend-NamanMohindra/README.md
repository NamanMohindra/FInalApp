Test Username: Naman
Test Password: 123

Frontend URL: https://webdevproject.surge.sh/ Backend URL: https://final-backendd.herokuapp.com

Test Followers : Bret, Bretaa


#Deploying backend 
1. git init
2. heroku create ricebookserver 
3. echo web: node index.js > Procfile
4. echo node_modules >> .gitignore
5. echo npm-debug.log >> .gitignore
6. git add .
7. git commit -m 'initial commit'
8. heroku buildpacks:set heroku/nodejs -a ricebookserver
9. git push heroku master
10. heroku ps:scale web=1