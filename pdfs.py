from flask import Flask,render_template,make_response,request,jsonify
import pdfkit

#creando el servidor  __name__ = nombre del archivo
app = Flask(__name__ , static_url_path='/static') #Para jalar  CSS yJS

# LA vista 
@app.route('/')
def temp():
	return render_template('tem.html')



# Los datos de la imagen ylos demas datos  
@app.route('/img', methods=["GET","POST"])
def img():
	global src
	src = request.form['src']
	return jsonify({'status': True}), 200




@app.route('/pdf/<name>/<location>', methods=["GET","POST"])
def pdf_template(name,location):

	rendered = render_template('pdf_template.html',name=name,location=location,src=src)
	css = ['pdf.css']
	pdf = pdfkit.from_string(rendered,False,css = css)

	pdf1 = pdfkit.from_string(rendered,name+".pdf",css = css)

	
	response = make_response(pdf)
	response.headers['Content-Type'] = 'application/pdf'
	response.headers['Content-Disposition'] = "inline; filename="+name+".pdf"
	return response, 200


if __name__ == '__main__':
	src=None
	app.run(debug=True,host='localhost',port=3000)

	# localhost:3000/temp