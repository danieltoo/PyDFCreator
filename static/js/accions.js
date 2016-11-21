
        $(function() {
            window.img =null; //guardar laimagen
            window.val = true;
            window.curp = "";
            window.edad=0;

            // Imagen de la camara
            var sayCheese = new SayCheese('#foto',{ snapshots: true }); //objeto de say
            sayCheese.on('start', function() {
              //this.takeSnapshot();
            });
            // Toamndo la foto
            $("#snapshot").click(function () { 
                sayCheese.takeSnapshot(320,240);
                return false;
            });

            sayCheese.on('snapshot', function(snapshot) {
                window.img = document.createElement('img');
                $(window.img).on('load',function () {
                    $("#foto-tomada").html("");
                    $('#foto-tomada').append("<h3> <i class='glyphicon glyphicon-picture'></i>Foto Tomada</h3>");
                    $('#foto-tomada').append(window.img);
                });

                window.img.src=snapshot.toDataURL('img/png');
                //Guardo el valor de la foto en una variable JSON
                var data = {
                    src : window.img.src
                }
                // --------Importante 
                $.ajax({  // envia al servidor 
                    url:'http://localhost:3000/img',
                    data:data,
                    type:'post',
                    success:function (respuesta) {
                        console.log(respuesta);
                    }
                });
                validando();
                if (!window.val) {
                        Push.create("Atención", {
                            body: "Faltan Campos por Llenar",
                            icon: 'static/img/error-icon-4.png',
                            timeout: 40000,
                            onClick: function () {
                                window.focus();
                                this.close();
                            }
                        });
                    }
                
                
            });
            function justNumbers(e){
               var keynum = window.event ? window.event.keyCode : e.which;
               if ((keynum == 8) || (keynum == 46))
                    return true;
                return /\d/.test(String.fromCharCode(keynum));
            }

            function validando() {
                
                if ($("#nombre").val()=="") {
                    $("#nonom").html("<div class='alert alert-warning' role='alert'>*No hay nombre</div>");
                    window.val=false;
                }
                if ($("#direccion").val()=="") {
                    $("#nodireccion").html("<div class='alert alert-warning' role='alert'>*No hay dirección</div>");
                    window.val=false;
                }

                if ($("#paterno").val()=="") {
                    $("#nopat").html("<div class='alert alert-warning' role='alert'>*No hay apellido paterno</div>");
                    window.val=false;
                }
                if ($("#materno").val()=="") {
                    $("#nomat").html("<div class='alert alert-warning' role='alert'>*No hay apellido materno</div>");
                    window.val=false;
                }
                if ($("#anio").val()=="") {
                    $("#noanio").html("<div class='alert alert-warning' role='alert'>*No hay año</div>");
                    window.val=false;
                }

                if ($("#sexo").val()=="0") {
                    $("#nosexo").html("<div class='alert alert-warning' role='alert'>*No has selecionado sexo</div>");
                    window.val=false;
                }
                if ($("#dia").val()=="0") {
                    $("#nodia").html("<div class='alert alert-warning' role='alert'>*No has selecionado dia</div>");
                    window.val=false;
                }
                if ($("#mes").val()=="0") {
                    $("#nomes").html("<div class='alert alert-warning' role='alert'>*No has selecionado mes</div>");
                    window.val=false;
                }
                if ($("#entidad").val()=="0") {
                    $("#noentidad").html("<div class='alert alert-warning' role='alert'>*No has selecionado entidad</div>");
                    window.val=false;
                }
                if (window.val) {
                    var datos ={
                      nombre            : $("#nombre").val(),
                      apellido_paterno  : $("#paterno").val(),
                      apellido_materno  : $("#materno").val(),
                      sexo              : $("#sexo").val(),
                      estado            : $("#entidad").val(),
                      fecha_nacimiento  : [$("#dia").val(), $("#mes").val(), $("#anio").val()]
                    }
                    var hoy = new Date();
                    var dd = hoy.getDate();
                    var mm = hoy.getMonth()+1; //hoy es 0!
                    var yyyy = hoy.getFullYear();
                    if(dd<10) {
                        dd='0'+dd
                    } 
                    if(mm<10) {
                        mm='0'+mm
                    } 
                    hoy = mm+'/'+dd+'/'+yyyy;
                    window.edad =0;
                    window.edad = yyyy-$("#anio").val();

                    if (mm-$("#mes").val() < 0) {
                        window.edad--;
                    }else if(mm-$("#mes").val() == 0){
                        if (dd-$("#dia").val() < 0) {
                            window.edad--;
                        } 
                    }
                    window.curp = generaCurp(datos);
                    $("#curp").html(`<div class="alert alert-info alert-dismissible" role="alert">
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <strong>Hola ${$("#nombre").val()}!</strong> <br>
                            Tu curp es: ${(window.curp)} <br>
                            Tienes ${(window.edad)} años
                        </div>`);
                }
                if (window.val && window.img != null) {
                    //nombre paterno materno sexo dia mes anio entidad
                    estado={
                        'AS':'Aguascalientes',
                        'BC':'Baja California',
                        'BS':'Baja California Sur',
                        'CC':'Campeche',
                        'CL':'Coahuila De Zaragoza',
                        'CM':'Colima',
                        'CS':'Chiapas',
                        'CH':'Chihuhua',
                        'DF':'Distrito Federal',
                        'DG':'Durango',
                        'GT':'Guanajuato',
                        'GR':'Guerrero',
                        'HG':'Hidalgo',
                        'JC':'Jalisco',
                        'MC':'Estado De Mexico',
                        'MN':'Michoacan De Ocampo',
                        'MS':'Morelos',
                        'NT':'Nayarit',
                        'NL':'Nuevo Leon',
                        'OC':'Oaxaca',
                        'PL':'Puebla',
                        'QT':'Queretaro De Arteaga',
                        'QR':'Quintana Roo',
                        'PT':'San Luis Potosi',
                        'SL':'Sinaloa',
                        'SR':'Sonora',
                        'TC':'Tabasco',
                        'TS':'Tamaulipas',
                        'TL':'Tlaxcala',
                        'VZ':'Veracruz',
                        'YN':'Yucatan',
                        'ZS':'Zacatecas',
                        'NE':'Extranjero'
                    }
                    var e = estado[$("#entidad").val()];

                    $('#imp').html(`<a href='/pdf/${$("#nombre").val()}/${$("#paterno").val()}/${$("#materno").val()}/${$("#sexo").val()}/${$("#dia").val()}/${$("#mes").val()}/${$("#anio").val()}/${e}/${$('#direccion').val()}/${window.edad}/${window.curp}'> <i class='glyphicon glyphicon-print' id='lin'></i>Imprimir PDF</a>`);

                    Push.create("Datos Verificados", {
                            body: "Ya puedes imprimir tu PDF",
                            icon: 'static/img/ok-xxl.png',
                            timeout: 40000,
                            onClick: function () {
                                window.focus();
                                this.close();
                            }
                        });
                    return true
                }else{
                   
                    $('#imp').html("");
                        window.val=true;
                        return false
                } 
                
                

            }
            //valida que todos los campos esten llenos
            $("#valida").click(function (e) {
                 
                validando();
                if (window.img == null) {
                        Push.create("Atención", {
                            body: "Aun no tomas tu foto",
                            icon: 'static/img/error-icon-4.png',
                            timeout: 40000,
                            onClick: function () {
                                window.focus();
                                this.close();
                            }
                        });
                    }
                
            });
            $("#lin").click(function (e) {
                Push.create("Espera un instante", {
                        body: "Estamos trabajando en tu PDF",
                        icon: 'static/img/profile.png',
                        timeout: 40000,
                        onClick: function () {
                            window.focus();
                            this.close();
                     }
                });
                return false
            });

            //Quitar el mensaje de error
            $("#anio").click(function (e) {
                $("#noanio").html("");
            });
            $("#sexo").click(function (e) {
                $("#nosexo").html("");
            });
            $("#mes").click(function (e) {
                $("#nomes").html("");
            });
            $("#dia").click(function (e) {
                $("#nodia").html("");
            });
            $("#entidad").click(function (e) {
                $("#noentidad").html("");
            });
            $("#direccion").click(function (e) {
                $("#nodireccion").html("");
            });
          sayCheese.start();
          $(document).ready(function(){
                $('.combobox').combobox();
              });
        });