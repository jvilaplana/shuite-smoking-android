// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EmployeeListView.prototype.template = Handlebars.compile($("#employee-list-tpl").html());
    EmployeeView.prototype.template = Handlebars.compile($("#employee-tpl").html());

    var slider = new PageSlider($('body'));

    var service = new EmployeeService();
    service.initialize().done(function () {
        router.addRoute('', function() {
            slider.slidePage(new HomeView(service).render().$el);
        });

        router.addRoute('employees/:id', function(id) {
            service.findById(parseInt(id)).done(function(employee) {
                slider.slidePage(new EmployeeView(employee).render().$el);
            });
        });

        router.start();
    });

    /* --------------------------------- Event Registration -------------------------------- */
    document.addEventListener('deviceready', function () {
      navigator.splashscreen.hide()
      StatusBar.overlaysWebView( false );
      StatusBar.backgroundColorByHexString('#ffffff');
      StatusBar.styleDefault();


      /* i18n */
      var cLANGUAGE = "";
      navigator.globalization.getPreferredLanguage(
          //Get Language from Settings
          function (locale) {
              cLANGUAGE = locale.value;
              languageControls(cLANGUAGE);
          },
          //On Failure set language to spanish
          function () {cLANGUAGE = "es";}
      );

      var languageSpecificObject = null;
      var languageSpecificURL = "";
      var catalanLanguageSpecificURL = "i18n/ca/strings.json";
      var spanishLanguageSpecificURL = "i18n/es/strings.json";
      var englishLanguageSpecificURL = "i18n/en/strings.json";

      //Function to make network call according to language on load
      var languageControls = function(language){
        console.log(language.toString());
          if((language.toString() == "en") || (language.toString() == "english") || (language.toString().indexOf("en") != -1)){
                  languageSpecificURL = englishLanguageSpecificURL;
          }
          else if((language.toString() == "ca") || (language.toString() == "catalan") || (language.toString().indexOf("ca") != -1)){
            languageSpecificURL = catalanLanguageSpecificURL;
          }
          else{
                  //Default English
                  languageSpecificURL = spanishLanguageSpecificURL;
          }
              //Make an ajax call to strings.json files
          onNetworkCall(languageSpecificURL,function(msg){
              languageSpecificObject = JSON.parse(msg);
              $(".languagespecificHTML").each(function(){
                  $(this).html(languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
              });
              $(".languageSpecificPlaceholder").each(function(){
                  $(this).attr("placeholder",languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
              });
              $(".languageSpecificValue").each(function(){
                  $(this).attr("value",languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
              });
          });
      };

      //Function to get specific value with unique key
      var getLanguageValue = function(key){
          value = languageSpecificObject.languageSpecifications[0][key];
          return value;
      };

      //Network Call
      var onNetworkCall = function(urlToHit,successCallback){
          $.ajax({
             type: "POST",
             url: urlToHit,
             timeout: 30000 ,
             }).done(function( msg ) {
                 successCallback(msg);
                     }).fail(function(jqXHR, textStatus, errorThrown){
                         alert("Internal Server Error");
                     });
      }



      FastClick.attach(document.body);
      if (navigator.notification) { // Override default HTML alert with native dialog
          window.alert = function (message) {
              navigator.notification.alert(
                  message,    // message
                  null,       // callback
                  "Workshop", // title
                  'OK'        // buttonName
              );
          };
      }
    }, false);

    /* ---------------------------------- Local Functions ---------------------------------- */


}());
