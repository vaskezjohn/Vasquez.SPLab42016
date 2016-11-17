<?php
	require_once("BeforeValidException.php");
	require_once("SignatureInvalidException.php");
	require_once("JWT.php");
	require_once("ExpiredException.php");
	require_once("usuario.php");
	$DatosPorPost = file_get_contents("php://input");
	$respuesta = json_decode($DatosPorPost);
	$correcto=false;
	$user;
	$usuarios=Usuario::ToArray();

	//echo json_encode($usuarios);
	foreach($usuarios as $usuario)
	{
		if($usuario["correo"]== $respuesta->correo && $usuario["nombre"]==$respuesta->nombre && $usuario["clave"]==$respuesta->clave)
		{
			$correcto=true;
			$user=$usuario;
			break;
		}
	}
	if($correcto)
	{
		$token=Array
		("exp"=>time()+10000,
		"id"=>$user["id"],
		"nombre"=>$user["nombre"],
		//"pass"=>$user["pass"], No se pasa el pass para no comprometer la cuenta del usuario.
		"correo"=>$user["correo"],
		"tipo"=>$user["tipo"]);
		$token=Firebase\JWT\JWT::encode($token, "LOL123");
		$array["segundoparcial"]=$token;
		echo json_encode($array);
	}
	else
	{
		echo false;
	}
?>