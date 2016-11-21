from flask import Flask,render_template,make_response,request,jsonify
import pdfkit

#creando el servidor  __name__ = nombre del archivo
app = Flask(__name__ , static_url_path='/static') #Para jalar  CSS yJS

# Muestra el index la pagina principal
@app.route('/')
def temp():
	return render_template('tem.html')



# Recibe unicamente los datos de la imagn para almacenarla temporalmente 
@app.route('/img', methods=["GET","POST"])
def img():
	global src
	src = request.form['src']# sacamos la variable que mando el cliente
	return jsonify({'status': True}), 200 #retornamosun json para confirmar



#Recibe los parametros que llevará el PDF
@app.route('/pdf/<nombre>/<paterno>/<materno>/<sexo>/<dia>/<mes>/<anio>/<entidad>/<direccion>/<edad>/<curp>', methods=["GET","POST"])
def pdf_template(nombre,paterno,materno,sexo,dia,mes,anio,entidad,curp,edad,direccion):
	data = { #Guarda los datos en variables de un diccionario para meterlos en la vista
		"nombre":nombre,
		"paterno":paterno,
		"materno":materno,
		"sexo":sexo,
		"dia":dia,
		"mes":mes,
		"anio":anio,
		"entidad":entidad,
		"curp":curp,
		"edad":edad,
		"direccion":direccion
	}
	rendered = render_template('pdf_template.html',data=data,src=src) #Renderiza la vista 
	css = ['static/vendor/bootstrap/css/bootstrap.css']
	pdf = pdfkit.from_string(rendered,False,css = css) # Crea el pdf que se mostrara en el navegador

	pdf1 = pdfkit.from_string(rendered,data["nombre"]+".pdf",css = css) #Crea el pdf almacenado 

	
	response = make_response(pdf) #Crea la respuesta para el navegador
	response.headers['Content-Type'] = 'application/pdf' #Indica que la respuesta sera de tipo PDF
	response.headers['Content-Disposition'] = "inline; filename="+data["nombre"]+".pdf" #Agrega el nombre que tendra el archivo al ser descargado
	return response, 200 #Envia la respuesta con un codigo 200 que significa que todo ocurrio correctamente


if __name__ == '__main__': # Ejecuta el codigo 
	src=None
	app.run(debug=True,host='localhost',port=3000) #inicia la aplicacion web