<?php
require_once"AccesoDatos.php";
class Producto
{
//--------------------------------------------------------------------------------//
//--ATRIBUTOS
	public $id;
	public $tipo;
 	public $ingredientes;
 	public $precio;
 	public $foto;

//--------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------//
//--GETTERS Y SETTERS
  	public function GetId()
	{
		return $this->id;
	}
	public function GetTipo()
	{
		return $this->tipo;
	}
		public function GetIngredientes()
	{
		return $this->ingredientes;
	}
	public function GetFoto()
	{
		return $this->foto;
	}
    public function GetPrecio()
    {
    	return $this->precio;
    }
	public function SetId($valor)
	{
		$this->id = $valor;
	}
	
	public function SetTipo($valor)
	{
		$this->tipo = $valor;
	}
	public function SetIngredientes($valor)
	{
		$this->ingredientes = $valor;
	}
	public function SetFoto($valor)
	{
		$this->foto = $valor;
	}
	public function SetPrecio($valor)
	{
		$this->precio = valor;
	}
//--------------------------------------------------------------------------------//
//--CONSTRUCTOR
	public function __construct($id=NULL)
	{
		if($id != NULL){
			$obj = Producto::TraerUnaProducto($id);
			$this->tipo = $obj->tipo;
			$this->ingredientes = $obj->ingredientes;
			$this->precio = $obj->precio;
			$this->foto = $obj->foto;
		}
	}
//--------------------------------------------------------------------------------//
//--METODO DE CLASE
	public static function TraerUnaProducto($idParametro) 
	{	


		$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
		$consulta =$objetoAccesoDato->RetornarConsulta("select * from misproductos where id =:id");
		$consulta->bindValue(':id', $idParametro, PDO::PARAM_INT);
		$consulta->execute();
		$productoBuscada= $consulta->fetchObject('producto');
		return $productoBuscada;	
					
	}
	
	public static function TraerTodasLasProductos()
	{
		$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
		$consulta =$objetoAccesoDato->RetornarConsulta("select * from misproductos");
		$consulta->execute();			
		$arrProductos= $consulta->fetchAll(PDO::FETCH_CLASS, "producto");	
		return $arrProductos;
	}
	
	public static function BorrarProducto($idParametro)
	{	
		$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
		$consulta =$objetoAccesoDato->RetornarConsulta("delete from misproductos WHERE id=:id");	
		$consulta->bindValue(':id',$idParametro, PDO::PARAM_INT);		
		$consulta->execute();
		return $consulta->rowCount();
		
	}
	
	public static function ModificarProducto($producto)
	{
			$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
			$consulta =$objetoAccesoDato->RetornarConsulta("
				update misproductos 
				set tipo=:tipo,
				ingredientes=:ingredientes,
				precio=:precio,
				foto=:foto
				WHERE id=:id");
			//$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
			//$consulta =$objetoAccesoDato->RetornarConsulta("CALL ModificarProducto(:id,:tipo,:apellido,:foto)");
			$consulta->bindValue(':id',$producto->id, PDO::PARAM_INT);
			$consulta->bindValue(':tipo',$producto->tipo, PDO::PARAM_STR);
			$consulta->bindValue(':ingredientes', $producto->ingredientes, PDO::PARAM_STR);
			$consulta->bindValue(':precio', $producto->precio, PDO::PARAM_STR);
			$consulta->bindValue(':foto', $producto->foto, PDO::PARAM_STR);
			return $consulta->execute();
	}



	public static function InsertarProducto($producto)
	{
		$objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso(); 
		$consulta =$objetoAccesoDato->RetornarConsulta("INSERT into misproductos (tipo,ingredientes,precio,foto)values(:tipo,:ingredientes,:precio,:foto)");
		//$consulta =$objetoAccesoDato->RetornarConsulta("CALL InsertarProducto (:tipo,:apellido,:dni,:foto)");
		$consulta->bindValue(':tipo',$producto->tipo, PDO::PARAM_STR);
		$consulta->bindValue(':ingredientes', $producto->ingredientes, PDO::PARAM_STR);
		$consulta->bindValue(':precio', $producto->precio, PDO::PARAM_STR);
		$consulta->bindValue(':foto', $producto->foto, PDO::PARAM_STR);
		$consulta->execute();		
		return $objetoAccesoDato->RetornarUltimoIdInsertado();
	
				
	}


}
