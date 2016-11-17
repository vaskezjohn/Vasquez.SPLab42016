<?php
	require_once("conexion.php");
	class Usuario
	{
		private $_id;
		private $_correo;
		private $_nombre;
		private $_clave;
		private $_tipo;
		public function __construct($id, $correo, $nombre, $clave, $tipo, $foto)
		{
			$this->_id=$id;
			$this->_correo=$correo;
			$this->_nombre=$nombre;
			$this->_clave=$clave;
			$this->_tipo=$tipo;
			$this->_foto=$foto;
		}
		public static function ToArray()
		{
			$conexion=Conexion::AccederDatos();
			$sentencia=$conexion->Prepare("SELECT * FROM misusuarios");
			$sentencia->Execute();
			$usuarios=$sentencia->fetchAll(PDO::FETCH_ASSOC);
			$conexion=null;
			return $usuarios;
		}
		public static function BuscarUsuario($id)
		{
			$conexion=Conexion::AccederDatos();
			$sentencia=$conexion->Prepare("SELECT * FROM misusuarios WHERE id=:id");
			$sentencia->bindValue(":id", $id, PDO::PARAM_INT);
			$sentencia->Execute();
			$usuario=$sentencia->fetchAll(PDO::FETCH_ASSOC);
			$conexion=null;
			return $usuario;
		}
		public function InsertarUsuario()
		{
			$conexion=Conexion::AccederDatos();
			$sentencia=$conexion->Prepare("INSERT INTO misusuarios(correo, nombre, clave, tipo, foto) VALUES (:correo, :nombre, :clave, :tipo, :foto)");
			$sentencia->bindValue(":correo", $this->_correo, PDO::PARAM_STR);
			$sentencia->bindValue(":nombre", $this->_nombre, PDO::PARAM_STR);
			$sentencia->bindValue(":clave", $this->_clave, PDO::PARAM_STR);
			$sentencia->bindValue(":tipo", $this->_tipo, PDO::PARAM_STR);
			$sentencia->bindValue(":foto", $this->_foto, PDO::PARAM_STR);
			$sentencia->Execute();
			$id=$conexion->lastInsertId();
			$conexion=null;
			return $id;
		}
		public function ModificarUsuario()
		{
			$conexion=Conexion::AccederDatos();
			$sentencia=$conexion->Prepare("UPDATE misusuarios SET correo=:correo, nombre=:nombre, clave=:clave, tipo=:tipo, foto=:foto WHERE id=:id");
			$sentencia->bindValue(":id", $this->_id, PDO::PARAM_INT);
			$sentencia->bindValue(":correo", $this->_correo, PDO::PARAM_STR);
			$sentencia->bindValue(":nombre", $this->_nombre, PDO::PARAM_STR);
			$sentencia->bindValue(":clave", $this->_clave, PDO::PARAM_STR);
			$sentencia->bindValue(":tipo", $this->_tipo, PDO::PARAM_STR);
			$sentencia->bindValue(":foto", $this->_foto, PDO::PARAM_STR);
			$sentencia->Execute();
			$conexion=null;
		}
		public static function EliminarUsuario($id)
		{
			$conexion=Conexion::AccederDatos();
			$sentencia=$conexion->Prepare("DELETE FROM misusuarios WHERE id=:id");
			$sentencia->bindValue(":id", $id, PDO::PARAM_INT);
			$sentencia->Execute();
			$conexion=null;
		}
		public function getId()
		{
			return $this->_id;
		}
		public function getMail()
		{
			return $this->_correo;
		}
		public function getUser()
		{
			return $this->_nombre;
		}
		public function getPass()
		{
			return $this->_clave;
		}
		public function getTipo()
		{
			return $this->_tipo;
		}
	}
?>