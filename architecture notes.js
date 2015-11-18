Our Architecture (what to keep)

App
--api (rename to server)
actions
  widgets(rename to resume)
utils
--bin
--docs
--src
   components
   containers
   helpers (keep everything)
   redux (reducers, keep everything)
   theme (rename to styles) (keep font awesome replace sass and bootstrap with material-ui)
   utils
   keep all additional files
--static (replace files)
--webpack
--test
   client
   server
update app.json


Files that Widgets touched (some now renamed):
   api/__tests__/api-test.js
   api/actions/index.js
   api/actions/resume/index.js
                     /load.js
                     /update.js
   src/components/index.js
   src/components/ResumeForm/ResumeForm.js
                            /resumeValidation.js
   src/containers/App/App.js
   src/containers/Home/Home.js
   src/containers/index.js
   src/containers/Resumes/Resumes.js
                         /Resumes.scss
   src/redux/modules/reducer.js
                    /resumes.js
   src/routes.js