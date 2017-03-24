(function () {

var app = angular.module('storyapp', ['ngAnimate']);

    app.controller('ActController', ActController);
    app.controller('ScriptController', ScriptController);
    app.service('StoryService', StoryService);

    // Deals with the script list
    app.component('scriptList', {
        templateUrl: 'static/scriptlist.html',
        controller: ScriptListComponentController,
        bindings: {
            scripts: '<',
            title: '@',
            onSelect: '&',
            onRemove: '&',
            onCreate: '&'

        }
    });

    // Deals with all acts once the user select a script
    app.component('acts', {
        templateUrl: 'static/acts.html',
        controller: ActComponentController,
        bindings: {
            scripts: '<',
            selected: '<',
            title: '@',
            showDetails: '@',
            onSelect: '&',
            onRemove: '&',
            onCreate: '&',
            onToggle: '&',
            onGetToggle: '&',
            onGetToggleLabel: '&',
            onNewScene: '&',
            onRemoveScene: '&'
        }
    });

    // Main menu
    app.component('scriptMenu', {
        templateUrl: 'static/script-menu.html',
        controller: ScriptMenuComponentController,
        bindings: {
            title: '@',
            onCreate: '&',
            onHelp: '&',
            onCollapse: '&',
            onClose: '&',
            menuTop: '@'
        }
    });
    //Modall handling
    app.directive('modalDialog', function() {
          return {
            restrict: 'E',
            scope: {
              show: '='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            link: function(scope, element, attrs, controller) {
              scope.dialogStyle = {};
              if (attrs.width)
                scope.dialogStyle.width = attrs.width;
              if (attrs.height)
                scope.dialogStyle.height = attrs.height;
              scope.hideModal = function() {
                scope.show = false;
              };
            },
            templateUrl: 'static/popup.html' // See below
          };
        });


    // Main controller
    ScriptController.$inject = ['$scope','StoryService'];
    function ScriptController($scope, StoryService) {
        var list = this;
        list.menuTop = true;
        list.scripts = StoryService.getScripts();
        list.selected = StoryService.getSelected();
        // Title is visible in top nav bar
        list.title = ("My scripts");

        // User select a script to work on.
        list.selectScript = function (itemIndex) {

            StoryService.selectScript(itemIndex);

        };
        list.removeScript = function (itemIndex) {

            StoryService.removeScript(itemIndex);
        };

        list.createScript = function () {
            StoryService.createScript();
        };


    };


    ScriptListComponentController.$inject = ['StoryService', '$element'];
    function ScriptListComponentController(StoryService, $element) {
        var $ctrl = this;
        var totalItems;

        // Check if there are any scripts created, if not we show the welcome box.
        $ctrl.$doCheck = function () {

            if ($ctrl.scripts.length !== totalItems) {
                totalItems = $ctrl.scripts.length;
                if (totalItems === 0) {
                    var e = $element.find('div.noscripts');
                    e.slideDown(500);
                } else {
                    var e = $element.find('div.noscripts');
                    e.slideUp(500);
                }
            }
        };



        // To remove a script
        $ctrl.remove = function (myIndex) {
            $ctrl.onRemove ({index: myIndex});
        };

        $ctrl.$onInit = function () {
            totalItems = 2;
            console.log('We are in $onInit(): ', $ctrl.scripts);
        };

        $ctrl.$onChanges = function (changeObj) {
            console.log(changeObj);
        };


    };



    function ScriptListDirectiveLink(scope, element, attrs, controller) {
        console.log(scope);
        console.log(controller);
        console.log(element);

        // Function not in use to check for certain words in title
        scope.$watch('list.funnyInList()', function (newValue, oldValue) {
            console.log('Old value: ', oldValue);
            console.log('New value: ', newValue);
            if (newValue == true) {
                displayFunnyWarning();
            } else {
                removeFunnyWarning();
            }
        });
        function displayFunnyWarning() {
            var warningElem = element.find("div.alert");
            warningElem.slideDown(300);
        };

        function removeFunnyWarning() {
            var warningElem = element.find("div.alert");
            warningElem.slideUp(300);
        };
    }


    // Main action for the acts
    ActController.$inject = ['$scope','StoryService'];
    function ActController($scope, StoryService) {
        $scope.oneAtATime = true;
        var myCtrl = this;
        myCtrl.acts = StoryService.getActs();
        myCtrl.showDetails = false;
        myCtrl.cToggleActs = "";
        myCtrl.sceneToggleLabel = "Show scenes"
        myCtrl.scripts = StoryService.getScripts();
        myCtrl.selected = StoryService.getSelected();
        myCtrl.toggledActs = StoryService.getToggledActs();

        myCtrl.closeScript = function () {
            StoryService.closeScript();
        };

        // Show and hide the scene list of an act
        myCtrl.toggleScenes = function (myIndex) {
            var index = myCtrl.toggledActs.indexOf(myIndex);
            console.log('List, index, index', myCtrl.toggledActs, myIndex, index);
            if (index > -1) {
                console.log('Toggle: hide', myIndex, index);
                StoryService.hideActToggle(myIndex);
            } else {
                console.log('Toggle: show', myIndex);
                StoryService.showActToggle(myIndex);
                console.log('List, myIndex, index', myCtrl.toggledActs, myIndex, index);
            }

        };

        // Get the toggle status so we can show the correct button text
        myCtrl.getSceneToggle = function (index) {
            if ($.inArray(index, myCtrl.toggledActs) > -1) {
                return true;
            } else {
                return false;
            }
        };
        myCtrl.getSceneToggleLabel = function (id) {
            if (myCtrl.getSceneToggle(id)) {
                return "Hide scenes";
            } else {
                return "Show scenes";
            };
        };

        myCtrl.createNewAct = function () {
            StoryService.createNewAct();
        };

        myCtrl.removeAct = function (index) {
            StoryService.removeAct(index);
        }

        myCtrl.newScene = function (index) {
            StoryService.newScene(index);
        };

        myCtrl.removeScene = function (sIndex, aIndex) {
            StoryService.removeScene(sIndex, aIndex);
        };
    };


    ActComponentController.$inject = ['$scope','$element', 'StoryService'];
    function ActComponentController($scope, $element, StoryService) {
        $ctrl = this;
        // When a user wants to remove a certain scene from an act.
        $ctrl.compRemoveScene = function (sIndexObj, actId) {

            var sIndex = sIndexObj.index;
            StoryService.removeScene(sIndex, actId);
        };



        $ctrl.$onInit = function () {
        };

        $ctrl.$onChanges = function (changeObj) {
        };


    };

    ScriptMenuComponentController.$inject = ['$scope'];
    function ScriptMenuComponentController ($scope) {
        var $ctrl = this;
        $ctrl.menuToggle = false;

        $ctrl.$onInit = function () {

            $ctrl.menuToggle = false;
            $ctrl.showModal = false;
        };


        $ctrl.toggleMenu = function () {
            $ctrl.menuToggle = !$ctrl.menuToggle;

            var menuElement = $('.app-collapse-menu');
            if ($ctrl.menuToggle) {
                menuElement.slideDown(300);
            } else {
                menuElement.slideUp(300);
            }

        };
        $scope.modalShown = false;
          $scope.toggleModal = function() {
            $scope.modalShown = !$scope.modalShown;
          };


    };




    // Its here We store all data about the users script
    // and keep track of the current scripts and acts.
    function StoryService() {
        var service = this;
        var newScriptScenes = [{header:"Scene 1", short:"A short description of the scene."},
                            {header:"Scene 2", short:"A short description of the scene."},
                            {header:"Scene 3", short:"A short description of the scene."}];
        var newScriptActs = [{id:1, header:"The beginning", short:"The start of the story. The act should end with the point of no return.", scenes:newScriptScenes},
                            {id:2, header:"The middle", short:"We build to main conflict and set up the end", scenes:newScriptScenes},
                            {id:3, header:"The end", short:"Pay off the entire story with a genius ending. Make us hurt!", scenes:newScriptScenes}];
        // Object to save the data for the users scripts, acts and scenes.
        var scripts = [];
        // Object to keep track of which script is selected.
        var selected = {script: null, act: null, scene: null};
        service.toggledActs = [];
        var currentAct = 0;

        // Check if the the scene list is shown or not.
        service.getToggledActs = function () {
            return service.toggledActs;
        };

        // If scenes are shown we put the act id in list to save toggle status and allow for multiple toggles.
        service.showActToggle = function (actIndex) {
            service.toggledActs.push(actIndex);
        };

        // We remove the act from toggle status list when scenes are hidden for that act
        service.hideActToggle = function (actIndex) {
            var index = service.toggledActs.indexOf(actIndex);
            service.toggledActs.splice(index, 1);
        };

        service.getActs = function () {
            return newScriptActs;
        };

        service.getScripts = function () {
            return scripts;
        };

        service.getSelected = function () {
            return selected;
        };


        //  A certain script is selected.
        service.selectScript = function (id) {
            selected.script = id;
            toggledActs = [];
        };

        service.closeScript = function () {
            selected.script = null;
        };

        service.createNewAct = function () {
            var newAct = {id:1, header:"New Act", short:"What is this act about?", scenes:[]};
            var act = scripts[selected.script].acts;
            act.push(newAct);
        };

        service.removeAct = function (index) {
            scripts[selected.script].acts.splice(index, 1);
        };

        service.removeScript = function (itemIndex) {
            scripts.splice(itemIndex, 1);
        };

        service.createScript = function () {
            // Checking if we have any scripts
            if (scripts.length == 0) {
                var newID = 1;
            } else {
                var lastScript = scripts[scripts.length - 1];
                var lastID = lastScript.id;
                var newID = lastID + 1
            }

            var newScript = {id:newID, title:"New script", short:"A short description", acts: newScriptActs};
            scripts.push(newScript);
        };

        service.newScene = function (myIndex) {
            var newScene = {header:"New scene", short:"Drama and conflicts."};
            var act = scripts[selected.script].acts[myIndex];
            act.scenes.push(newScene);

        };

        service.removeScene = function (sIndex, actId) {
            var acts = scripts[selected.script].acts;
            var act = acts[0];
            // Find the current Act
            for (var i = 0; i < acts.length; i++) {
                var id = acts[i].id;
                if (id == actId ) {
                    var scenes = acts[i].scenes;
                    scenes.splice(sIndex, 1);
                    break;
                }
            }

        };

    };











})();