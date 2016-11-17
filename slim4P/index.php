<?php
require 'Slim/Slim.php';
require_once 'app/libs/Array2XML.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

define("SPECIALCONSTANT", true);
require 'app/libs/connect.php';

require 'app/routes/api.php';

require_once("../PHP/clases/usuario.php");
require_once("../PHP/clases/Producto.php");
//require_once("php/Mascotas.php");
//require_once("php/Personas.php");
//require_once("php/coches.php");

$app->run();