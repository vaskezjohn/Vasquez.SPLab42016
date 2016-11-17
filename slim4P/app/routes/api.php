<?php
if(!defined("SPECIALCONSTANT")) die("Acceso denegado");
// var_dump($app);

// GET: Para consultar y leer recursos
// POST: Para crear recursos
// PUT: Para editar recursos
// DELETE: Para eliminar recursos

// GET: Para consultar y leer recursos



$app->get("/usuarios/", function() use($app)
{	
	$respuesta=Usuario::ToArray();

	$app->response->status(200);
	$app->response->body(json_encode($respuesta));
});

$app->get("/usuarios/:id", function($id) use($app)
{
	$respuesta=Usuario::BuscarUsuario($id);

	$app->response->status(200);
	$app->response->body(json_encode($respuesta));
});
//sin
// POST: Para crear recursos
$app->post("/usuarios/", function() use($app)
{
	$respuesta = json_decode($app->request->getBody());
	$datos=$respuesta->usuario;

	switch($respuesta->opcion)
	{
		case "alta":
		{
			$usuario=new Usuario(0, $datos->correo, $datos->nombre, $datos->clave, $datos->tipo, $datos->foto);
			$id=$usuario->InsertarUsuario();
			$datos=(array)$datos;
			$datos["id"]=$id;
			$datos=(object)$datos;
			if($datos->foto!="pordefecto.png")
			{
				$rutaVieja="../fotos/".$datos->foto;
				$rutaNueva=$datos->id.".".PATHINFO($rutaVieja, PATHINFO_EXTENSION);
				copy($rutaVieja, "../fotos/".$rutaNueva);
				//unlink($rutaVieja);
				$datos->foto=$rutaNueva;
				$usuario=new Usuario($datos->id, $datos->correo, $datos->nombre, $datos->clave, $datos->tipo, $datos->foto);
				$usuario->ModificarUsuario();
			}
			break;
		}
		case "baja":
		{
			Usuario::EliminarUsuario($datos->id);
			if($datos->foto!="pordefecto.png")
			{
				unlink("../fotos/".$datos->foto);
			}
			break;
		}
		case "modificacion":
		{
			$datos=(object)$datos;
			if($datos->foto!="pordefecto.png")
			{
				$rutaVieja="../fotos/".$datos->foto;
				$rutaNueva=$datos->id.".".PATHINFO($rutaVieja, PATHINFO_EXTENSION);
				copy($rutaVieja, "../fotos/".$rutaNueva);
				//unlink($rutaVieja);
				$datos->foto=$rutaNueva;
				$usuario=new Usuario($datos->id, $datos->correo, $datos->nombre, $datos->clave, $datos->tipo, $datos->foto);
				$usuario->ModificarUsuario();
			}
			break;
		}
		default:
		{
			break;
		}
	}
	$app->response->status(200);	
	$app->response->body(json_encode($datos));
});
$app->get("/productos/", function() use($app)
{	
	$respuesta=Producto::TraerTodasLasProductos();
	$app->response->status(200);
	$app->response->body(json_encode($respuesta));
});
$app->get("/productos/:id", function($id) use($app)
{	
	$respuesta=Producto::BuscarProductosPaciente($id);
	$app->response->status(200);
	$app->response->body(json_encode($respuesta));
});
$app->post("/productos/", function() use($app)
{
	$respuesta = json_decode($app->request->getBody());
	$datos=$respuesta->producto;
	switch($respuesta->opcion)
	{
		case "alta":
		{
			$id=Producto::InsertarProducto($datos);
			$datos=(array)$datos;
			$datos["id"]=$id;
			$datos=(object)$datos;

			break;
		}
		case "baja":
		{
			Producto::BorrarProducto($datos->id);

			break;
		}
		case "modificacion":
		{
			echo "Estoy en la API de SLIM" + $datos->id;
			Producto::ModificarProducto($datos);
			break;
		}
		default:
		{
			break;
		}
	}
	$app->response->status(200);	
	$app->response->body(json_encode($datos));
});

