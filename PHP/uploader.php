<?php
	if ( !empty( $_FILES ) ) 
	{
		$formato=PATHINFO($_FILES['file']['name'], PATHINFO_EXTENSION);
		$peso=$_FILES['file']['size'];
		if($formato=="jpg" || $formato=="jpeg" || $formato=="png")
		{
			if($peso>0 && $peso<1000000)
			{
				$temporal = $_FILES[ 'file' ][ 'tmp_name' ];
				$ruta = "../fotos/".$_FILES[ 'file' ][ 'name' ];
				move_uploaded_file( $temporal, $ruta );
				echo "correcto";
			}
			else
			{
				echo "El tamaño de la imagen no puede superar 1 MB";
			}
		}
		else
		{
			echo "El archivo debe tener formato jpg, jpeg o png";
		}
	}
?>