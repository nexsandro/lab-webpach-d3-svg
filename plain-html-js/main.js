

(
    {
        processo : function() {

            var editor = new Editor(1400, 800);

            var eventoInicio = new EventoInicio(150, 150);
            eventoInicio.name = 'Inicio de Processo';
    
            var eventoFim = new EventoFim(1325, 300);
            eventoFim.name = 'Fim de Processo';
    
            var atividade = new Atividade(1050, 250);
            atividade.name = 'Atividade #5';
    
            var decisao = new Decisao(850, 125);
            decisao.name = 'Teste decisivo';
            
            var atividadeConectada1 = new Atividade(300, 100);
            var atividadeConectada2 = new Atividade(1050, 100);
            var atividadeConectada3 = new Atividade(800, 250);
            var atividadeConectada4 = new SubProcess(550, 100);
    
            atividadeConectada1.name = 'Verificar condicoes de credito'
            atividadeConectada2.name = 'Atividade #2'
            atividadeConectada3.name = 'Atividade #3'
            atividadeConectada4.name = 'Aprovacao de Negocio'
    
            eventoInicio.advisor.connectTo( atividadeConectada1 );
            atividadeConectada1.advisor.connectTo( atividadeConectada4 );
            atividadeConectada4.advisor.connectTo( decisao );
            decisao.advisor.connectTo( atividadeConectada2 );
            decisao.advisor.connectTo( atividadeConectada3 );
            atividadeConectada2.advisor.connectTo( atividade );
            atividadeConectada3.advisor.connectTo( atividade );
            atividade.advisor.connectTo( eventoFim );
    
            var risk1 = new Risk(600, 400);
            var risk2 = new Risk(800, 400);
            var risk3 = new Risk(1000, 400);
            risk1.name = 'Risk #1';
            risk2.name = 'Risk #2';
            risk3.name = 'Risk #3';
            risk1.advisor.connectTo(atividadeConectada3, 'risk-association');
            risk2.advisor.connectTo(atividadeConectada3, 'risk-association');
            risk3.advisor.connectTo(atividadeConectada3, 'risk-association');
    
            var riskControl1 = new RiskControl(100, 400);
            riskControl1.name = 'Risk Control #1';
    
            editor.addShape(eventoInicio);
            editor.addShape(eventoFim);
            editor.addShape(atividade);
            editor.addShape(decisao);
            editor.addShape(atividadeConectada1);
            editor.addShape(atividadeConectada2);
            editor.addShape(atividadeConectada3);
            editor.addShape(atividadeConectada4);
            editor.addShape(risk1);
            editor.addShape(risk2);
            editor.addShape(risk3);
            editor.addShape(riskControl1);
    
            var editorRenderer = new EditorRenderer();
    
            var redAlert = new Alert(1400, 100);
            redAlert.level = 'HIGH';
            editor.addShape(redAlert);
    
            var yellowAlert = new Alert(1420, 100);
            yellowAlert.level = 'MEDIUM';
            editor.addShape(yellowAlert);
    
            var greenAlert = new Alert(1440, 100);
            greenAlert.level = 'LOW';
            editor.addShape(greenAlert);
    
    
            editorRenderer.render( 'body', editor );
            editor.renderShapes();
    
        }, 
        subprocesso: function() {

            var editor = new Editor(1400, 800);

            var eventoInicio = new EventoInicio(300, 150);
            eventoInicio.name = 'Inicio de Processo';
    
            var eventoFim = new EventoFim(1250, 150);
            eventoFim.name = 'Fim de Processo';
                
            var atividadeConectada1 = new Atividade(400, 100);
            var atividadeConectada2 = new Atividade(600, 100);
            var atividadeConectada3 = new Atividade(800, 100);
            var atividadeConectada4 = new Atividade(1000, 100);
    
            atividadeConectada1.name = 'Atividade #1'
            atividadeConectada2.name = 'Atividade #2'
            atividadeConectada3.name = 'Atividade #3'
            atividadeConectada4.name = 'Atividade #4'
    
            eventoInicio.advisor.connectTo( atividadeConectada1 );
            atividadeConectada1.advisor.connectTo( atividadeConectada2 );
            atividadeConectada2.advisor.connectTo( atividadeConectada3 );
            atividadeConectada3.advisor.connectTo( atividadeConectada4 );
            atividadeConectada4.advisor.connectTo( eventoFim );
    
            var risk1 = new Risk(600, 250);
            var risk2 = new Risk(800, 250);
            risk1.name = 'Risk #1';
            risk2.name = 'Risk #2';
            atividadeConectada2.advisor.connectTo(risk1);
            atividadeConectada3.advisor.connectTo(risk2);
    
            var riskControl1 = new RiskControl(100, 300);
            var riskControl2 = new RiskControl(100, 400);
            riskControl1.name = 'Risk Control #1';
            riskControl2.name = 'Risk Control #2';
            riskControl1.advisor.connectTo(risk1);
            riskControl1.advisor.connectTo(risk2);
            riskControl2.advisor.connectTo(risk1);
            riskControl2.advisor.connectTo(risk2);
    
            editor.addShape(eventoInicio);
            editor.addShape(eventoFim);
            editor.addShape(atividadeConectada1);
            editor.addShape(atividadeConectada2);
            editor.addShape(atividadeConectada3);
            editor.addShape(atividadeConectada4);
            editor.addShape(risk1);
            editor.addShape(risk2);
            editor.addShape(riskControl1);
            editor.addShape(riskControl2);
    
            var editorRenderer = new EditorRenderer();    
    
            editorRenderer.render( 'body', editor );
            editor.renderShapes();
        }
    }
    

).processo();