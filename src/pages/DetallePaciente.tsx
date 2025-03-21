import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Baby,Ruler, Calendar, ClipboardList,Crown, Clock, Edit,Hourglass, Printer, User, Weight, Activity, Sticker } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { dbService, Paciente } from '../services/db';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DocumentoImprimible from '@/components/DocumentoImprimible';
import { formatDate } from '../utils/dateUtils';

const DetallePaciente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarDocumento, setMostrarDocumento] = useState(false);

  useEffect(() => {
    const cargarPaciente = async () => {
      if (!id) return;
      
      try {
        const pacienteData = await dbService.obtenerPacientePorId(parseInt(id));
        if (pacienteData) {
          setPaciente(pacienteData);
        } else {
          toast.error('Paciente no encontrado');
          setTimeout(() => navigate('/'), 1500);
        }
      } catch (error) {
        console.error('Error al cargar paciente:', error);
        toast.error('Error al cargar los datos del paciente');
      } finally {
        setLoading(false);
      }
    };

    cargarPaciente();
  }, [id, navigate]);
  



  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'Fecha no válida';
  
      // Extraer día, mes y año
      const dia = date.getDate() +1; // Día del mes (1-31)
      const mes = date.getMonth() + 1; // Mes (0-11) + 1 para ajustar a 1-12
      const año = date.getFullYear(); // Año (4 dígitos)
  
      // Formatear como "día/mes/año"
      return `${dia}/${mes}/${año}`;
    } catch (e) {
      return 'Fecha no válida';
    }
  };

//   const calcularEdad = (fechaNacimiento: string) => {
//     try {
//         // Convertir la fecha de nacimiento al formato Date
//         const [dia, mes, anio] = fechaNacimiento.split('/').map(Number);
//         const fechaNac = new Date(anio, mes - 1, dia); // Los meses en Date son 0-indexados
        
//         const hoy = new Date();
        
//         // Validar si la fecha es válida
//         if (isNaN(fechaNac.getTime())) return 'Fecha no válida';
        
//         // Calcular la edad
//         const edad = hoy.getFullYear() - fechaNac.getFullYear();
//         const mesActual = hoy.getMonth() - fechaNac.getMonth();
        
//         // Ajustar la edad si aún no ha pasado el cumpleaños este año
//         if (mesActual < 0 || (mesActual === 0 && hoy.getDate() < fechaNac.getDate())) {
//             return `${edad - 1} años`;
//         }
        
//         // Si la edad es 0, calcular meses o días
//         if (edad === 0) {
//             const meses = hoy.getMonth() - fechaNac.getMonth() + 
//                 (hoy.getDate() < fechaNac.getDate() ? -1 : 0) + 
//                 (hoy.getMonth() < fechaNac.getMonth() ? 12 : 0);
            
//             if (meses === 0) {
//                 const dias = Math.floor((hoy.getTime() - fechaNac.getTime()) / (1000 * 60 * 60 * 24));
//                 return `${dias} días`;
//             }
            
//             return `${meses} meses`;
//         }
        
//         return `${edad} años`;
//     } catch (e) {
//         return 'Error en fecha';
//     }
// };


// const calcularEdad = (fechaNacimiento: string) => {
//   try {
//       // Convertir la fecha de nacimiento al formato Date
//       const [dia, mes, anio] = fechaNacimiento.split('/').map(Number);
//       const fechaNac = new Date(anio, mes - 1, dia); // Restamos 1 al mes
      
//       const hoy = new Date();
      
//       // Validar si la fecha es válida
//       if (isNaN(fechaNac.getTime())) return 'Fecha no válida';
      
//       // Verificar que la fecha de nacimiento no sea en el futuro
//       if (fechaNac > hoy) return 'La fecha de nacimiento no puede ser en el futuro';
      
//       // Calcular la diferencia en días
//       const diferenciaMilisegundos = hoy.getTime() - fechaNac.getTime();
//       const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
      
//       // Calcular la edad en años
//       let edad = hoy.getFullYear() - fechaNac.getFullYear();
//       const mesActual = hoy.getMonth() - fechaNac.getMonth();
      
//       // Si es un recién nacido (menos de 30 días), retornar los días
//       if (dias < 30) {
//           return `${dias} días`;
//       }
      
//       // Si tiene menos de un año, calcular los meses y días correctamente
//       if (edad === 0) {
//           const meses = mesActual + (hoy.getDate() < fechaNac.getDate() ? -1 : 0);
//           const diasRestantes = hoy.getDate() >= fechaNac.getDate()
//               ? hoy.getDate() - fechaNac.getDate()
//               : new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate() - fechaNac.getDate() + hoy.getDate();
          
//           return `${meses} meses y ${diasRestantes} días`;
//       }
      
//       // Ajustar la edad si aún no ha pasado el cumpleaños este año
//       if (mesActual < 0 || (mesActual === 0 && hoy.getDate() < fechaNac.getDate())) {
//           edad--;
//       }
      
//       // Calcular los meses y días restantes
//       let meses = mesActual >= 0 ? mesActual : 12 + mesActual;
//       if (hoy.getDate() < fechaNac.getDate()) {
//           meses--;
//       }
//       const diasRestantes = hoy.getDate() >= fechaNac.getDate()
//           ? hoy.getDate() - fechaNac.getDate()
//           : new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate() - fechaNac.getDate() + hoy.getDate();
      
//       return `${edad} años, ${meses} meses y ${diasRestantes} días`;
//   } catch (e) {
//       return 'Error en fecha';
//   }
// };

  const calcularPorcentajeDiferenciaPeso = () => {
    if (!paciente?.peso || !paciente?.pesoEgreso) return '-';
    
    try {
      const pesoNacimiento = parseFloat(paciente.peso);
      const pesoEgreso = parseFloat(paciente.pesoEgreso);
      
      if (isNaN(pesoNacimiento) || isNaN(pesoEgreso) || pesoNacimiento === 0) {
        return 'Error en cálculo';
      }
      
      const porcentaje = ((pesoEgreso * 100) / pesoNacimiento) - 100;
      return porcentaje.toFixed(2) + '%';
    } catch (e) {
      return 'Error en cálculo';
    }
  };

  const SeccionEncabezado = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark:bg-gray-800/80 dark:text-white">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-blue-600">
            {paciente?.nombre} {paciente?.apellido}
          </h2>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-2">

          <div className="flex items-center">
              <Calendar className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Fecha de nacimiento: {formatearFecha(paciente?.fechaNacimiento || '')}
              </span>
            </div>
          
            <div className="flex items-center">
              <ClipboardList className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Historia Clínica: {paciente?.numeroHistoriaClinica}</span>
            </div>
            
           
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Hora de nacimiento: {paciente?.horaNacimiento}
              </span>
            </div>

        
            
            <div className="flex items-center">
              <User className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Sexo: {paciente?.sexo === 'M' ? 'Masculino' : paciente?.sexo === 'F' ? 'Femenino' : paciente?.sexo || 'No especificado'}
              </span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Edad: {paciente?.ddv || '-'} ddv
              </span>
            </div>
            <div className="flex items-center">
              <Sticker className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Número de pulsera: {paciente?.pulsera} 
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 mt-4 md:mt-0 space-x-2">
          <Button 
            variant="outline"
            onClick={() => setMostrarDocumento(true)}
            className="border-medical-600 text-medical-600 hover:bg-medical-50 dark:text-medical-300 dark:border-medical-300 dark:hover:bg-gray-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Epicrisis
          </Button>
          
          <Button 
            className="bg-medical-600 hover:bg-medical-700 text-white" 
            onClick={() => navigate(`/editar-paciente/${id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>
    </div>
  );

  const SeccionDatosNacimiento = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark: dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-blue-600">Datos de Nacimiento</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


      <div className="flex items-center">
              <Weight className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Peso: {paciente?.peso} gramos.
              </span>
            </div>
      <div className="flex items-center">
              <Ruler className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Talla: {paciente?.talla} cm.
              </span>
            </div>
      <div className="flex items-center">
              <Crown className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Perímetro cefálico: {paciente?.perimetroCefalico} cm.
              </span>
            </div>
      <div className="flex items-center">
              <Hourglass className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Edad gestacional: {paciente?.edadGestacional} semanas.
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                APGAR: {paciente?.apgar} 
              </span>
            </div>

      
        
        
        
        
        
        
        
        
        {/* <div>
          <p className="text-sm text-gray-500 dark:text-white">DDV</p>
          <p className="font-medium text-gray-800">{paciente?.ddv || '-'}</p>
        </div> */}
        
        {/* <div>
          <p className="text-sm text-gray-500 dark:text-white">HC</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.hc || '-'}</p>
        </div> */}
        
        
        
        
      </div>
    </div>
  );

  const SeccionDatosParto = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-blue-600">Datos del Parto</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Nacido por: {paciente?.nacidoPor} 
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Presentación: {paciente?.presentacion} 
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Líquido Amniótico: {paciente?.liquidoAmniotico} 
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Ruptura de Membranas: {paciente?.rupturaMembranas} 
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Clasificación: {paciente?.clasificacion} 
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Procedencia: {paciente?.procedencia} 
              </span>
            </div>
        
      </div>
    </div>
  );

  const SeccionPersonalMedico = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-blue-600">Personal de Recepción</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div>
          <p className="text-sm text-gray-500 dark:text-white">Sector de Internación</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.sectorInternacion || '-'}</p>
        </div> */}

<div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Obstétra: {paciente?.obstetra} 
              </span>
            </div>
<div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Enfermera: {paciente?.enfermera} 
              </span>
            </div>
<div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Neonatólogo/a: {paciente?.neonatologo} 
              </span>
            </div>
        
        
      </div>
    </div>
  );

  const SeccionVacunacionPesquisa = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-blue-600">Vacunación y Pesquisa</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2 dark:text-white">Vacunación HBsAg</h4>
          <div className="flex items-center mb-2">
            <Badge variant="outline" className={paciente?.vacunacionHbsag ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
              {paciente?.vacunacionHbsag ? 'Aplicada' : 'No aplicada'}
            </Badge>
          </div>
          {paciente?.vacunacionHbsag && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-white">Lote</p>
                  <p className="font-medium text-gray-800 dark:text-white">{paciente?.loteHbsag || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-white">Fecha</p>
                  <p className="font-medium text-gray-800 dark:text-white">{formatDate(paciente?.fechaHbsag || '')}</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-2 dark:text-white">Vacunación BCG</h4>
          <div className="flex items-center mb-2">
            <Badge variant="outline" className={paciente?.vacunacionBcg ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
              {paciente?.vacunacionBcg ? 'Aplicada' : 'No aplicada'}
            </Badge>
          </div>
          {paciente?.vacunacionBcg && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-white">Lote</p>
                  <p className="font-medium text-gray-800 dark:text-white">{paciente?.loteBcg || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-white">Fecha</p>
                  <p className="font-medium text-gray-800 dark:text-white">{formatDate(paciente?.fechaBcg || '')}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2 dark:text-white">Pesquisa Metabólica</h4>
        <div className="flex items-center mb-2">
          <Badge variant="outline" className={paciente?.pesquisaMetabolica ? "bg-green-50  text-green-600 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}>
            {paciente?.pesquisaMetabolica ? 'Realizada' : 'No realizada'}
          </Badge>
        </div>
        {paciente?.pesquisaMetabolica && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-sm text-gray-500dark:text-white">Protocolo</p>
                <p className="font-medium text-gray-800dark:text-white">{paciente?.protocoloPesquisa || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500dark:text-white">Fecha</p>
                <p className="font-medium text-gray-800dark:text-white">{formatDate(paciente?.fechaPesquisa || '')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500dark:text-white">Hora</p>
                <p className="font-medium text-gray-800dark:text-white">{paciente?.horaPesquisa || '-'}</p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2 dark:text-white">Grupo y Factor</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Recién Nacido</p>
            <p className="font-medium text-gray-800 dark:text-white">{paciente?.grupoFactorRn || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Materno</p>
            <p className="font-medium text-gray-800 dark:text-white">{paciente?.grupoFactorMaterno || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white">PCD</p>
            <p className="font-medium text-gray-800 dark:text-white">{paciente?.pcd || '-'}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2 dark:text-white">Laboratorios</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Bilirrubina Total</p>
            <p className="font-medium text-gray-800 dark:text-white">{paciente?.bilirrubinaTotalValor || '-'} mg/dl</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Bilirrubina Directa</p>
            <p className="font-medium text-gray-800 dark:text-white">{paciente?.bilirrubinaDirectaValor || '-'} mg/dl</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white">Hematocrito</p>
            <p className="font-medium text-gray-800 dark:text-white">{paciente?.hematocritoValor || '-'} %</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Otros laboratorios</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.laboratorios || '-'}</p>
        </div>
      </div>
    </div>
  );

  const SeccionDatosEgreso = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-blue-600">Datos del Egreso</h3>
      
      {/* Primera fila: 4 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Fecha</p>
          <p className="font-medium text-gray-800 dark:text-white">{formatDate(paciente?.fechaEgreso || '')}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Hora</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.horaEgreso || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Peso</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.pesoEgreso || '-'} g</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">% Diferencia Peso</p>
          <p className="font-medium text-gray-800 dark:text-white">{calcularPorcentajeDiferenciaPeso()}</p>
        </div>
      </div>
      
      {/* Campos de texto en una sola columna */}
      <div className="mb-4">
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-white">Evolución durante la internación</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.evolucionInternacion || '-'}</p>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-white">Diagnósticos</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.diagnosticos || '-'}</p>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-white">Indicaciones al egreso</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.indicacionesEgreso || '-'}</p>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-white">Observaciones</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.observaciones || '-'}</p>
        </div>
      </div>
      
      {/* Última fila: 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Enfermera</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.enfermeraEgreso || '-'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Neonatólogo/a</p>
          <p className="font-medium text-gray-800 dark:text-white">{paciente?.neonatologoEgreso || '-'}</p>
        </div>
      </div>
    </div>
  );

  const SeccionDatosMaternos = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-blue-600">Datos Maternos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Nombre y Apellido: {paciente?.datosMaternos} 
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Número de documento: {paciente?.numeroHistoriaClinica} 
              </span>
            </div>
      <div className="flex items-center">
              <Activity className="w-4 h-4 text-medical-600 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">
                Número de teléfono: {paciente?.telefono} 
              </span>
            </div>
      
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
        <div>
          <p className="text-sm text-gray-500 dark:text-white">SARS-CoV-2 (PCR)</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.sarsCov2 === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.sarsCov2 === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.sarsCov2 || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Chagas</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.chagas === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.chagas === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.chagas || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Toxoplasmosis</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.toxoplasmosis === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.toxoplasmosis === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.toxoplasmosis || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">HIV</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.hiv === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.hiv === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.hiv || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">VDRL</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.vdrl === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.vdrl === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.vdrl || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">Hepatitis B</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.hepatitisB === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.hepatitisB === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.hepatitisB || 'No realizado'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-white">EGB</p>
          <Badge 
            variant="outline" 
            className={
              paciente?.egb === 'Positivo' 
                ? 'bg-red-50 text-red-600 border-red-200' 
                : paciente?.egb === 'Negativo'
                  ? 'bg-green-50 text-green-600 border-green-200'
                  : 'bg-gray-50 text-gray-600 border-gray-200'
            }
          >
            {paciente?.egb || 'No realizado'}
          </Badge>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-medical-200 border-t-medical-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Cargando datos del paciente...</p>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Paciente no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">No se encontró información para este paciente.</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6"
        >
          <button 
            onClick={() => navigate('/')}
            className="mr-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detalles del Paciente</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <SeccionEncabezado />
          
          <SeccionDatosNacimiento />
          
          <SeccionDatosParto />
          
          <SeccionPersonalMedico />
          
          <SeccionVacunacionPesquisa />
          
          <SeccionDatosMaternos />

          <SeccionDatosEgreso />
          
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la lista de pacientes
            </Button>
          </div>
        </motion.div>
      </div>
      
      {mostrarDocumento && paciente && (
        <DocumentoImprimible 
          paciente={paciente} 
          onClose={() => setMostrarDocumento(false)} 
        />
      )}
    </div>
  );
};

export default DetallePaciente;
