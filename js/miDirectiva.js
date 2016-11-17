angular.module("ABMangularPHP")
.directive("abmDirectiva", function()
{
	return	{
				template:"<div style='color:skyblue'>{{texto}}</div>",
				restrict:"EAC",
				scope:{texto:'='} 
			};
});

// angular.module("ABMangularPHP")
// .directive("listadoUsuarios", function()
// {
// 	return	{
// 				restrict:"A",
// 				replace : true,
// 				scope:{
// 					usuarioDinamico:'=usuario'
// 				},
// 				templateUrl:"./templateUsuarios.html" 
// 			};
// });