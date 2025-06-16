import { gql } from '@apollo/client';

export const LOGIN_CLIENTE = gql`
  mutation LoginCliente($correoElectronico: String!, $contrasenaHash: String!) {
    LoginCliente(correoElectronico: $correoElectronico, contrasenaHash: $contrasenaHash)
  }
`;

export const LOGIN_AGENTE = gql`
  mutation LoginAgente($nombreUsuario: String!, $contrasenaHash: String!) {
    LoginAgente(nombreUsuario: $nombreUsuario, contrasenaHash: $contrasenaHash)
  }
`;

export const BUSCA_CLIENTE = gql`
  query BuscaCliente($id_cliente: ID!) {
    buscaCliente(id_cliente: $id_cliente) {
      id_cliente
      idTipoDocumento {
        idTipoDocumento
        nombre
      }
      nombre
      apellido
      numeroDocumento
      correoElectronico
      direccion
      telefono
    }
  }
`;

export const BUSCA_AGENTE = gql`
  query BuscaAgente($id_agente: ID!) {
    buscaAgente(id_agente: $id_agente) {
      id_agente
      nombreUsuario
      correoElectronico
      direccion
      telefono
    }
  }
`;

// Query para obtener lista de agentes (para encontrar por nombreUsuario)
export const LISTA_AGENTES = gql`
  query ListaAgentes {
    listaAgentes {
      id_agente
      nombreUsuario
      correoElectronico
      direccion
      telefono
    }
  }
`;

// Query para obtener lista de clientes (para encontrar por correo)
export const LISTA_CLIENTES = gql`
  query ListaClientes {
    listaClientes {
      id_cliente
      idTipoDocumento {
        idTipoDocumento
        nombre
      }
      nombre
      apellido
      numeroDocumento
      correoElectronico
      direccion
      telefono
    }
  }
`;

export const INSERTAR_CLIENTE = gql`
  mutation InsertarCliente($clientesInput: ClientesInput!) {
    insertarCliente(clientesInput: $clientesInput) {
      id_cliente
      nombre
      apellido
      correoElectronico
      direccion
      telefono
    }
  }
`;

// Query para obtener los tipos de documento disponibles
export const LISTA_TIPOS_DOCUMENTO = gql`
  query ListaTiposDocumento {
    listaTiposDocumento {
      idTipoDocumento
      nombre
    }
  }
`;

// Mutación para actualizar cliente
export const UPDATE_CLIENTE = gql`
  mutation UpdateCliente($id_cliente: ID!, $clientesInput: ClientesInput!) {
    updateCliente(id_cliente: $id_cliente, clientesInput: $clientesInput) {
      id_cliente
      nombre
      apellido
      direccion
      correoElectronico
      telefono
      numeroDocumento
      idTipoDocumento {
        nombre
      }
    }
  }
`;

// Nueva mutación para actualizar perfil sin contraseña
export const UPDATE_CLIENTE_PROFILE = gql`
  mutation UpdateClienteProfile($id_cliente: ID!, $clientesUpdateInput: ClientesUpdateInput!) {
    updateClienteProfile(id_cliente: $id_cliente, clientesUpdateInput: $clientesUpdateInput) {
      id_cliente
      nombre
      apellido
      direccion
      correoElectronico
      telefono
      numeroDocumento
      idTipoDocumento {
        nombre
      }
    }
  }
`;

// Query para obtener envíos de un cliente
export const ENVIOS_POR_CLIENTE = gql`
  query EnviosPorCliente($id_cliente: Int!) {
    enviosPorCliente(id_cliente: $id_cliente) {
      id_envio
      numeroGuia
      direccionEnvio
      fechaCompra
      precio
      id_estado {
        id_estado
        nombre
      }
      id_cliente {
        id_cliente
        nombre
        apellido
      }
    }
  }
`;

// Query para obtener TODOS los envíos (para admin)
export const OBTENER_ENVIOS = gql`
  query ObtenerEnvios {
    obtenerEnvios {
      id_envio
      numeroGuia
      direccionEnvio
      fechaCompra
      precio
      id_estado {
        id_estado
        nombre
      }
      id_cliente {
        id_cliente
        nombre
        apellido
        correoElectronico
      }
    }
  }
`;

// Query para obtener comentarios de un envío
export const COMENTARIOS_POR_ENVIO = gql`
  query ComentariosPorEnvio($id_envio: ID!) {
    comentariosporEnvio(id_envio: $id_envio) {
      id_comentario
      contenido
    }
  }
`;

// Mutación para agregar comentario (con campos requeridos)
export const AGREGAR_COMENTARIO = gql`
  mutation AgregarComentario($id_envio: Int!, $contenido: String!) {
    agregarComentario(id_envio: $id_envio, contenido: $contenido) {
      id_comentario
      contenido
    }
  }
`;

// Mutación para actualizar estado de envío
export const UPDATE_ENVIO = gql`
  mutation UpdateEnvio($id_envio: ID!, $enviosInput: EnviosInput!) {
    uptadeEnvio(id_envio: $id_envio, enviosInput: $enviosInput) {
      id_envio
      numeroGuia
      direccionEnvio
      fechaCompra
      precio
      id_estado {
        id_estado
        nombre
      }
      id_cliente {
        id_cliente
        nombre
        apellido
      }
    }
  }
`;

// Query para obtener la lista de estados (temporal: usando obtenerEnvios para extraer estados únicos)
export const LISTA_ESTADOS = gql`
  query ListaEstados {
    obtenerEnvios {
      id_estado {
        id_estado
        nombre
      }
    }
  }
`;

// Queries para satisfacción de clientes
export const LISTA_SATISFACCIONES = gql`
  query ListaSatisfacciones {
    listaSatisfacciones {
      id_satisfaccion
      fechaEncuesta
      calificacion
      comentario_satisfaccion
      id_cliente {
        id_cliente
        nombre
        apellido
      }
      id_envio {
        id_envio
        numeroGuia
      }
    }
  }
`;

export const SATISFACCIONES_POR_FECHA = gql`
  query SatisfaccionesPorFecha($fechaInicio: String!, $fechaFin: String!) {
    satisfaccionesPorFecha(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
      id_satisfaccion
      fechaEncuesta
      calificacion
      comentario_satisfaccion
      id_cliente {
        id_cliente
        nombre
        apellido
      }
      id_envio {
        id_envio
        numeroGuia
      }
    }
  }
`;

// Queries para promociones de clientes
export const PROMOCIONES_POR_CLIENTE = gql`
  query PromocionesPorCliente($id_cliente: Int!) {
    promocionesPorCliente(id_cliente: $id_cliente) {
      id_promocion
      titulo
      descripcion
      fechaInicio
      fechaFin
      id_cliente {
        id_cliente
        nombre
        apellido
      }
    }
  }
`; 