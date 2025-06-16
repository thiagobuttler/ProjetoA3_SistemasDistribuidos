
export default function(jsonFile) { return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
    <style>
      .m-btn.primary {
        background-color: #000 !important;
      }
    </style>    
  </head>
  <body>
    <rapi-doc spec-url="${jsonFile}" show-header="false" show-method-in-nav-bar="as-colored-text" use-path-in-nav-bar="true" 
    allow-advanced-search="false" allow-search="false" primary-color ="#303030" nav-bg-color="#eeeeee" nav-text-color="#202020">

      <div slot="nav-logo" style="display: flex; align-items: center;">
        <img src="https://api.iconify.design/oui:documentation.svg" style="width:20px; margin-right: 6px;"/>
        <img src="https://api.iconify.design/carbon:api-1.svg" style="width:60px;"/>
      </div>

    </rapi-doc>
  </body>
</html>
`
}