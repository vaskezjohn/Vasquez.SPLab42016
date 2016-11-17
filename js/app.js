
var app = angular.module('ABMangularPHP', ['ui.router', 'angularFileUpload', 'satellizer'])//esto permite incluir el módulo 'ui.router' al módulo 'ABMangularPHP'
.config(function($stateProvider, $urlRouterProvider, $authProvider)
{ 
	$authProvider.loginUrl = 'facultad/SegParcial/PHP/clases/Autentificador.php';
	$authProvider.signupUrl = 'facultad/SegParcial/PHP/clases/Autentificador.php';
	$authProvider.tokenName = 'segundoparcial';
	$authProvider.tokenPrefix = 'ejemploabm';
	$authProvider.authHeader = 'data';
	$stateProvider
	.state('menu',
	{url: '/menu',
	templateUrl: 'menu.html',
	controller: 'controlMenu'})
	.state('alta',
	{url: '/alta',
	templateUrl: 'alta.html',
	controller: 'controlAlta'})
	.state('modificacion',
	{url: '/modificacion',
	templateUrl: 'alta.html',
	controller: 'controlModificacion'})
	.state('grilla',
	{url: '/grilla',
	templateUrl: 'grilla.html',
	controller: 'controlGrilla'})
	.state('login',
	{url: '/login',
	templateUrl: 'login.html',
	controller: 'controlLogin'})
	.state('altaUser',
	{url: '/altaUser',
	templateUrl: 'altaUser.html',
	controller: 'controlAltaUser'})
	.state('modificacionUser',
	{url: '/modificacionUser',
	templateUrl: 'altaUser.html',
	controller: 'controlModificacionUser'})
	.state('grillaUser',
	{url: '/grillaUser',
	templateUrl: 'grillaUser.html',
	controller: 'controlGrillaUser'})
	.state('grafico',
	{url: '/grafico',
	templateUrl: 'grafico.html',
	controller: 'controlGrafico'});
	// .state('carta',
	// {url:'/carta',
	// templateUrl:'carta.html',
	// controller:'eleccion'});
	
	$urlRouterProvider.otherwise('/login');
});

app.controller('controlIndex', function($scope, $auth, $http,$state, $timeout)
{
	$scope.visible=false;
	$scope.usuario={};
	if($auth.isAuthenticated())
	{
		$scope.visible=true;
		$scope.usuario=$auth.getPayload();
	}
	console.info($scope.visible);
});


app.controller('controlMenu', function($scope, $auth, $state, $http, factoryUsuario)
{
	
	if($auth.isAuthenticated())
	{
		console.info($auth.isAuthenticated(), $auth.getPayload());
		$scope.DatoTest="**Menu**";
		$scope.usuario=$auth.getPayload();
		$scope.CargarModificacion=function(usuario)
		{
			factoryUsuario.setUsuario(usuario);
			$state.go("modificacionUser");
		}
		$scope.GenerarPdf=function()
		{
			window.open('http://localhost:8080/SP-master/php/generadorpdf.php');
		};
		$scope.GenerarExcel=function()
		{
			$http.get("http://localhost:8080/Practica Segundo Parcial/php/generadorexcel.php")
			.then(function(respuesta)
			{
				console.log(respuesta);
				location.href='http://localhost:8080/Practica Segundo Parcial/php/Informe.xlsx';
			},function errorCallback(response)
			{
				console.log(response);
			});
			/*ventana=window.open('http://localhost:8080/tplabiv/php/generadorexcel.php');
			ventana.close();
			location.href='http://localhost:8080/tplabiv/php/Informe.xlsx';*/
		};
		$scope.Logout=function()
		{
			$auth.logout()
			.then(function()
			{
				$state.go("login");
			});
		};
	}
	else
	{
		$state.go("login");
	}
	$scope.CargarFormulario=function()
		{
			$state.go("altaUser");
		};
});


app.controller('controlAlta', function($scope, $state, FileUploader, $auth, cargadorDeFoto, cargador)
{
	if($auth.isAuthenticated() && $auth.getPayload().tipo!="comprador")
	{
		$scope.DatoTest="**Alta**";


		//inicio las variables
		$scope.uploader=new FileUploader({url:'PHP/uploader.php'});
		$scope.producto={};
		$scope.producto.foto="";
        $scope.visible=true;

		$scope.Insertar=function()
		{
			//$scope.producto.fecha_nac=$scope.producto.dia+"/"+$scope.producto.mes+"/"+$scope.producto.anio;
			cargador.InsertarProducto($scope.producto).then(function(respuesta)
			{
				console.log(respuesta);
				$state.go("grilla");
			});
		};
		$scope.Guardar=function()
		{
			if($scope.producto.tipo!=undefined && $scope.producto.ingredientes!=undefined && $scope.producto.precio!=undefined)
			{
				var datosVacios=false;
				for(var dato in $scope.producto)
				{
					if(!$scope.producto.hasOwnProperty(dato))
					{
						continue;
					}
					if($scope.producto[dato]==="")
					{
						datosVacios=true;
					}
				}
				if(!datosVacios)
				{
					
						$scope.Insertar();
					
					console.log("producto a guardar:");
					console.log($scope.producto);
				}
				else
				{
					alert("No puede ingresar datos vacíos.");
				}
			}
			else
			{
				alert("No puede ingresar datos vacíos.");
			}
		}
	}
	else
	{
		$state.go("login");
	}
});


app.controller('controlGrilla', function($scope, $state, $auth, cargador, factoryProducto)
{
	if($auth.isAuthenticated())
	{
		$scope.esAdmin={};
		$scope.DatoTest="**Grilla**";
		if($auth.getPayload().tipo=="administrador" || $auth.getPayload().tipo=="vendedor")
		{
			$scope.esAdmin=true;
		}
		else
		{
			$scope.esAdmin=false;
		}
		cargador.BuscarProductos()
		.then(function(respuesta)
		{
			console.log(respuesta);
			$scope.ListadoProductos = respuesta;
		});
		$scope.Borrar=function(producto)
		{
			cargador.EliminarProducto(producto)
			.then(function(respuesta)
			{       
				console.log(respuesta);
				cargador.BuscarProductos()
				.then(function(respuesta)
				{
					$scope.ListadoProductos = respuesta;
					console.log(respuesta);
				});				
			});
		}
		$scope.CargarModificacion=function(producto)
		{
			console.info(producto);
			factoryProducto.setProducto(producto);
			$state.go("modificacion");
		}
		$scope.FiltrarProductos=function(producto)
		{
			if($scope.buscador!=undefined && $scope.buscador!="")
			{
				return (producto.nombre.toLowerCase().indexOf($scope.buscador.toLowerCase())!=-1)// || producto.apellido.toLowerCase().indexOf($scope.buscador.toLowerCase())!=-1);
			}
			else
			{
				return true;
			}
		}
	}
	else
	{
		$state.go("login");
	}
});
app.controller('controlModificacion', function($scope, $state, $auth, FileUploader, cargadorDeFoto, cargador, factoryProducto)//, $routeParams, $location)
{
	$scope.visible=false;
	if($auth.isAuthenticated() && $auth.getPayload().tipo!="comprador")
	{
		$scope.producto={};
		$scope.DatoTest="**Modificar**";
		$scope.uploader=new FileUploader({url:'PHP/uploader.php'});
		$scope.producto=factoryProducto.getProducto();//esto carga el formulario para poder modificarlo
		$scope.Guardar=function()
		{   
			console.log("estoy en controlmodificar");
			//console.info($scope.producto);

			if($scope.producto.tipo!=undefined && $scope.producto.ingredientes!=undefined && $scope.producto.precio!=undefined)
			{
				var datosVacios=false;
				for(var dato in $scope.producto)
				{
					console.info($scope.producto.hasOwnProperty(dato));
					if(!$scope.producto.hasOwnProperty(dato))
					{
						continue;
					}
					if($scope.producto[dato]==="")
					{
						datosVacios=true;
					}
				}
				if(!datosVacios)
				{
					$scope.GuardarDatos();
				}
				else
				{
					alert("Alerta1: No puede ingresar datos vacíos.");
				}
			}
			else
			{
				alert("Alerta2: No puede ingresar datos vacíos.");
			}
		};
		$scope.GuardarDatos=function()
		{
			cargador.ModificarProducto($scope.producto)
			.then(function(respuesta) 
			{    	
				console.log(respuesta);
				$state.go("grilla");
			});
		};
		if($scope.producto==undefined)
		{
			$state.go("grilla");
		}
	}
	else
	{
		$state.go("login");
	}
});
app.controller('controlLogin', function($scope, $auth, $state)
{
	$scope.CargarLogin=function(dato){
		switch(dato)
		{
			case 'admin':
			$scope.correo="admin@admin.com";
			$scope.nombre="admin";
			$scope.clave="321";
			break;
			
			case 'comp':
			$scope.correo="comp@comp.com";
			$scope.nombre="comp";
			$scope.clave="123";
			break;
			
			case 'vend':
			$scope.correo="vend@vend.com";
			$scope.nombre="vend";
			$scope.clave="321";
			break;
		}

	}
	if($auth.isAuthenticated())
	{
		$state.go("menu");
	}
	else
	{
		$scope.DatoTest="**Iniciar Sesión**";
		$scope.correo="admin@admin.com";
		$scope.nombre="admin";
		$scope.clave="321";
		$scope.Login=function()
		{
			$auth.login({correo:$scope.correo, nombre:$scope.nombre, clave:$scope.clave})
			.then(function(respuesta)
			{
				console.log(respuesta);
				location.reload();
				if($auth.isAuthenticated())
				{

					console.info($auth.isAuthenticated(), $auth.getPayload());

					$state.go("menu");
				}
				else
				{
					alert("No se encontró el usuario. Verifique los datos.");
				}
			});
		};
		$scope.CargarFormulario=function()
		{
			$state.go("altaUser");
		};
	}
});// fin control login
app.controller('controlAltaUser', function($scope, $auth, $state, cargador, cargadorDeFoto, FileUploader)
{
	$scope.visible=true;
	if(true)
	{
		$scope.aceptar="Crear Cuenta";
		$scope.titulo="Nuevo Usuario";
		$scope.uploader=new FileUploader({url:'PHP/uploader.php'});
		$scope.usuario={};
		$scope.usuario.nombre= "SOS" ;
		$scope.usuario.correo= "SOS@SOS.com" ;
		$scope.usuario.clave= "123" ;
		$scope.usuario.foto="pordefecto.png";
		$scope.usuario.tipo="comprador";
		cargadorDeFoto.CargarFoto($scope.usuario.foto, $scope.uploader);
		$scope.uploader.onSuccessItem=function(item, response, status, headers)
		{
			if(response=="correcto")
			{
				$scope.Insertar();
				console.info("Ya guardé el archivo.", item, response, status, headers);
			}
			else
			{
				alert(response);
			}
		};
		$scope.Insertar=function()
		{
			cargador.InsertarUsuario($scope.usuario)
			.then(function(respuesta)
			{   	
				console.log(respuesta);
				$state.go("grillaUser");

			});
		};
		$scope.Guardar=function()
		{
			if($scope.usuario.nombre!=undefined && $scope.usuario.correo!=undefined && $scope.usuario.clave!=undefined)
			{
				var datosVacios=false;
				for(var dato in $scope.usuario)
				{
					if(!$scope.usuario.hasOwnProperty(dato))
					{
						continue;
					}
					if($scope.usuario[dato]==="")
					{
						datosVacios=true;
					}
				}
				if(!datosVacios)
				{
					console.log($scope.uploader.queue);
					if($scope.uploader.queue[0]!=undefined && $scope.uploader.queue[0]._file.name!="./fotos/pordefecto.png")
					{
						var nombreFoto = $scope.uploader.queue[0]._file.name;
						$scope.usuario.foto=nombreFoto;
						$scope.uploader.uploadAll();
					}
					else
					{
						$scope.usuario.foto="pordefecto.png";
						$scope.Insertar();
					}
					console.log("usuario a guardar:");
					console.log($scope.usuario);
				}
				else
				{
					alert("No puede haber datos vacíos");
				}
			}
			else
			{
				alert("No puede haber datos vacíos");
			}
		}
	}
	else
	{
		$state.go("grillaUser");
	}
});
app.controller('controlModificacionUser', function($scope, $auth, $state, cargador, factoryUsuario, FileUploader, cargadorDeFoto)
{
	$scope.visible=false;
	if($auth.isAuthenticated())
	{
		$scope.usuario={};
		$scope.usuario=factoryUsuario.getUsuario();
		if($scope.usuario!=undefined)
		{
			$scope.uploader=new FileUploader({url:'PHP/uploader.php'});
			$scope.tipo="Modificar Datos";
			$scope.bloquear=true;
			cargadorDeFoto.CargarFoto($scope.usuario.foto, $scope.uploader);

			console.info($scope.uploader);
			$scope.uploader.onSuccessItem=function(item, response, status, headers)
			{
				if(response=="correcto")
				{
					$scope.Insertar();
					console.info("Ya guardé el archivo.", item, response, status, headers);
				}
				else
				{
					alert(response);
				}
			};
			$scope.Insertar=function()
			{
				cargador.ModificarUsuario($scope.usuario)
				.then(function(respuesta)
				{   	
					console.log(respuesta);
					location.reload();
					$state.go("grillaUser");

				});
			};

		
			$scope.Guardar=function()
			{
				if($scope.usuario.nombre!=undefined && $scope.usuario.correo!=undefined && $scope.usuario.clave!=undefined)
				{
					var datosVacios=false;
					for(var dato in $scope.usuario)
					{
						if(!$scope.usuario.hasOwnProperty(dato))
						{
							continue;
						}
						if($scope.usuario[dato]==="")
						{
							datosVacios=true;
						}
					}
					if(!datosVacios)
					{
						console.info($scope.uploader.queue);
						console.info("entro aca");
						if($scope.uploader.queue[0]!=undefined && $scope.uploader.queue[0]._file.name!="../fotos/pordefecto.png")
						{
							var nombreFoto = $scope.uploader.queue[0]._file.name;
							$scope.usuario.foto=nombreFoto;
							$scope.uploader.uploadAll();
						}
						else
						{
							$scope.usuario.foto="pordefecto.png";
							$scope.Insertar();
						}
						console.log("usuario a guardar:");
						console.log($scope.usuario);
					}
					else
					{
						alert("No puede haber datos vacíos");
					}
				}
				else
				{
					alert("No puede haber datos vacíos");
				}
			}
		}
		else
		{
			$state.go("menu");
		}
	}
	else
	{
		$state.go("menu");
	}
});
app.controller('controlGrillaUser', function($scope, $state, $auth, cargador,factoryUsuario)
{
	

	if($auth.isAuthenticated() && $auth.getPayload().tipo=="administrador")
	{
		$scope.esAdmin={};
		if($auth.getPayload().tipo=="administrador")
		{
			$scope.esAdmin=true;
		}
		else
		{
			$scope.esAdmin=false;
		}
		$scope.buscadorTipo="todos";
		cargador.BuscarUsuarios()
		.then(function(respuesta)
		{     	

			$scope.ListadoUsuarios = respuesta;
			console.log(respuesta);
		});
		$scope.Borrar=function(usuario)
		{
			if(confirm("¿Desea eliminar el usuario seleccionado?"))
			{
				console.log("borrar"+usuario);
				cargador.EliminarUsuario(usuario)
				.then(function(respuesta)
				{      
					console.log(respuesta);
					cargador.BuscarUsuarios()
					.then(function(respuesta)
					{
						$scope.ListadoUsuarios = respuesta;
						console.log(respuesta);

					});
				});
			}
		}
		$scope.FiltrarUsuarios=function(usuario)
		{
			if($scope.buscadorTipo!="todos")
			{
				return (usuario.tipo==$scope.buscadorTipo);
			}
			else
			{
				return true;
			}
		}
		$scope.CargarModificacion=function(usuario)
		{
			factoryUsuario.setUsuario(usuario);
			$state.go("modificacionUser");
		}
	}
	else
	{
		$state.go("login");
	}
});
app.controller('controlGrafico', function($scope, $auth, $state, cargador)
{
	if($auth.isAuthenticated() && $auth.getPayload().tipo=="admin")
	{
		$scope.contadorPF=0;
		$scope.contadorPM=0;
		$scope.contadorGF=0;
		$scope.contadorGM=0;
		$scope.CargarDatos=function()
		{
			cargador.BuscarProductos().then(function(productos)
			{
				console.log(productos);
				for(var i=0;i<productos.length;i++)
				{
					if(productos[i].tipo=="Perro")
					{
						if(productos[i].sexo=="Femenino")
						{
							$scope.contadorPF++;
						}
						else
						{
							$scope.contadorPM++;
						}
					}
					else if(productos[i].tipo=="Gato")
					{
						if(productos[i].sexo=="Femenino")
						{
							$scope.contadorGF++;
						}
						else
						{
							$scope.contadorGM++;
						}
					}
				}
				$scope.CargarGrafico();
			});
		}
		$scope.CargarGrafico=function()
		{
			//console.log("LOL");
			$('#container').highcharts
			({
				chart:
				{
					type: 'bar'
				},
				title:
				{
					text: 'Tipos de Producto'
				},
				subtitle:
				{
					text:''
				},
				xAxis:
				{
					categories: ["Perros", "Gatos"],
					title:
					{
						text: "Productos"
					}
				},
				yAxis:
				{
					min: 0,
					title:
					{
						text: 'Cantidad de Productos',
						align: 'high'
					},
					labels:
					{
						overflow: 'justify'
					}
				},
				tooltip:
				{
					valueSuffix: ' Productos'
				},
				plotOptions:
				{
					bar:
					{
						dataLabels:
						{
							enabled: true
						}
					}
				},
				legend:
				{
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -40,
					y: 0,
					floating: true,
					borderWidth: 1,
					backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
					shadow: true
				},
				credits:
				{
					enabled: false
				},
				series:
				[{
					name: 'Femenino',
					data: [$scope.contadorPF, $scope.contadorGF]
				}, {
					name: 'Masculino',
					data: [$scope.contadorPM, $scope.contadorGM]
				}]
			});
		}
		$scope.CargarDatos();
	}
	else
	{
		$state.go("login");
	}
});
app.service('cargadorDeFoto', function($http, FileUploader)
{
	this.CargarFoto=function(nombreFoto, uploader)
	{
		var direccion="./fotos/"+nombreFoto;
		$http.get(direccion, {responseType: "blob"})
		.then(function(respuesta)
		{
			var mimeType=respuesta.data.type;
			var archivo=new File([respuesta.data], direccion, {type:mimeType});
			var dummy=new FileUploader.FileItem(uploader, {});
			dummy._file=archivo;
			dummy.file={};
			dummy.file=new File([respuesta.data], nombreFoto, {type:mimeType});
			uploader.queue.push(dummy);
		});
	};
});
app.service('cargador', function($http)
{
	function MostrarError(error)
	{
		console.log(error);
	}
	var url="http://localhost:8080/facultad/SegParcial/slim4P/";
	this.BuscarUsuarios=function()
	{
		return $http.get(url+"usuarios")
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError);
	}
	this.BuscarUsuario=function(id)
	{
		return $http.get(url+"usuarios/"+id)
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError);
	}
	this.InsertarUsuario=function(usuario)
	{
		return $http.post(url+"usuarios", {opcion:"alta", usuario:usuario})
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError)
	}
	this.EliminarUsuario=function(usuario)
	{
		return $http.post(url+"usuarios", {opcion:"baja", usuario:usuario},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError)
	}
	this.ModificarUsuario=function(usuario)
	{
		return $http.post(url+"usuarios", {opcion:"modificacion", usuario:usuario})
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError)
	}
	this.BuscarProductos=function()
	{
		return $http.get(url+"productos")
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError);
	}
	this.BuscarProducto=function(id)
	{
		return $http.get(url+"productos/"+id)
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError);
	}
	this.InsertarProducto=function(producto)
	{
		console.info(producto);
		return $http.post(url+"productos", {opcion:"alta", producto:producto})
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError)
	}
	this.EliminarProducto=function(producto)
	{
		return $http.post(url+"productos", {opcion:"baja", producto:producto},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError)
	}
	this.ModificarProducto=function(producto)
	{
		return $http.post(url+"productos", {opcion:"modificacion", producto:producto})
		.then(function(respuesta)
		{
			return respuesta.data;
		}, MostrarError)
	}
});
app.factory('factoryProducto', function()
{
	var producto;
	return	{
				getProducto:function()
				{
					return producto;
				},
				setProducto:function(nuevaProducto)
				{
					producto=nuevaProducto;
				}
			}
});
app.factory('factoryUsuario', function()
{
	var usuario;
	return	{
				getUsuario:function()
				{
					return usuario;
				},
				setUsuario:function(nuevaUsuario)
				{
					usuario=nuevaUsuario;
				}
			}
});

app.directive('midirectiva',function()
{

return {

	      restrict: 'AE',
	      scope:  { 
	      	usuario: '@'
	      },
	      templateUrl:'Usuario.html',
	      link: function(scope,elemt,attr)
	      { 
	      	console.log(elemt);
	      	console.log(scope);
	      	console.log(attr);
               scope.clienteLogeado={};
               scope.clienteLogeado.nombre= attr.usuario;

	      }

	  };

}//fin funcion

);// FIN DIRECTIVA