angular.module('DTBS.main')
.controller('MongoController', [
  '$scope',
  '$timeout',
  'CodeParser',
  'mongoData',
  'AccessSchemaService',
  function ($scope, $timeout, CodeParser, mongoData, AccessSchemaService) {
    //object for schema storage
    $scope.schemaStorage = {};
    $scope.currentSchema = {keys: {}}; //will need to add name: attr: id: and a list: as a new schema is created.
    //incrementing id for table creation in child scopes
    $scope.id = 0;
    $scope.typeEdit = 'none'; 
    $scope.addingKey = false;
    $scope.nestedList = []; //this will store list of nested documents that keys can be added to, including top level
    $scope.view = true;
    var secondsToWaitBeforeSave = 0; //??
    var secondsToWaitBeforeRender = 1; //??

    //show the modal for adding/editing schemas
    $scope.visibleEditModal = false;
    $scope.toggleEditModal = function (value) {
      if (value){
        $scope.typeEdit = value;
      }
      $scope.visibleEditModal = !$scope.visibleEditModal;

    };

    $scope.setSchema = function (schemaName) {
      console.log(schemaName);
      for (var key in $scope.schemaStorage){
        if ($scope.schemaStorage.key["name"] === schemaName){
          $scope.currentSchema = $scope.schemaStorage.key;
          console.log($scope.currentSchema);
        }
      }
    };

    $scope.addKey = function (name) {
      console.log($scope.currentSchema);
      //checked and name is coming through
      if ($scope.currentSchema === {}){ //not sure if this works
        $scope.currentSchema.id = $scope.id;
        $scope.currentSchema.name = name;
      };
      $scope.addingKey = true;
    };

    $scope.saveKey = function (name, value) {
      var key = name;
      $scope.currentSchema.keys[name] = {type: value}; 
      console.log($scope.currentSchema.keys);
      $scope.addingKey = false;
    }

    $scope.deleteKey = function () {
      //reach into $scope.currentSchema, find the selected key, delete it

    };
  
    $scope.deleteSchema = function (schema) {
      //delete schema from schemaStorage and clear $scope.schemaStorage

    };

    $scope.editDone = function () {
      $scope.toggleEditModal('none');
      $scope.schemaStorage[$scope.id] = $scope.currentSchema;
      console.log($scope.schemaStorage);
      //SAVE SCHEMA
      //take currentSchema that has been entered, set $scope.schemaStorage[$scope.currentID] = $scope.currentSchema
      $scope.currentSchema = {keys: {}};
      $scope.id++
      $scope.interactCanvas();
    };

    $scope.interactCanvas = function () {
      //info to send to d3, all manipulation needs to be finished before calling this.
      var updatedData = angular.copy($scope.schemaStorage);
      mongoData.push(updatedData);
    };

    $scope.toggleCanvasView = function () {
      $('#mongoDesignCanvas').find('svg').toggle();
      $scope.view = !$scope.view;
    };

    $scope.saveSVG = function () {
      if ($scope.view) {
        svg_xml = document.getElementById('tree');
      } else {
        svg_xml = document.getElementById('dendro');
      }  
      var serializer = new XMLSerializer();
      var str = serializer.serializeToString(svg_xml);

      // Create a canvas
      var canvas = document.createElement('canvas');
      canvas.height = 350;
      canvas.width = 640;
      canvas.style.background = 'white';

      canvg(canvas, str);
      context = canvas.getContext("2d");

      // set to draw behind current content
      context.globalCompositeOperation = "destination-over";

      // set background color
      context.fillStyle = '#fff';

      // draw background / rect on entire canvas
      context.fillRect(0, 0, canvas.width, canvas.height);
      var a = document.createElement('a');
      a.href = canvas.toDataURL("schemas/png");
      a.download = 'schemas.png';
      a.click();
      a.remove();
      canvas.remove();
    };
  }
]);
