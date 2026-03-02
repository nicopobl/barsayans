# Infraestructura como Código - Barsayans Academy

Este directorio contiene la infraestructura de Terraform para Barsayans Academy en Google Cloud Platform (GCP).

## Estructura

```
infra/
├── modules/
│   ├── database/          # Módulo de Firestore
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── storage/           # Módulo de Google Cloud Storage
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── environments/
    ├── qa/                # Ambiente de QA
    │   ├── main.tf
    │   ├── variables.tf
    │   ├── providers.tf
    │   ├── outputs.tf
    │   ├── terraform.tfvars
    │   └── .gitignore
    └── prod/              # Ambiente de Producción (similar estructura)
```

## Prerrequisitos

1. **Terraform** >= 1.0 instalado
2. **Google Cloud SDK** instalado y configurado
3. **Service Account** con permisos adecuados:
   - `Firestore Admin`
   - `Storage Admin`
   - `Service Account User`

## Configuración Inicial

### 1. Crear Service Account

1. Ve a [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Crea una nueva Service Account
3. Asigna los roles necesarios:
   - `Firestore Admin`
   - `Storage Admin`
4. Genera una clave JSON y descárgala
5. Coloca el archivo JSON en `infra/environments/qa/gcp-service-account.json`

### 2. Configurar Variables

Edita `infra/environments/qa/terraform.tfvars`:

```hcl
gcp_project_id  = "tu-proyecto-gcp"
region          = "us-central1"
environment     = "qa"
project_name    = "barsayans"
suffix          = "qa"
allowed_origins = ["http://localhost:3000"]
```

### 3. Inicializar Terraform

```bash
cd infra/environments/qa
terraform init
```

### 4. Plan y Aplicar

```bash
# Ver qué se va a crear
terraform plan

# Aplicar cambios
terraform apply
```

## Outputs

Después de aplicar, Terraform mostrará los outputs:

```bash
terraform output
```

Usa estos valores para configurar tu `.env.local`:

- `gcs_bucket_name` → `GCS_BUCKET_NAME`
- `gcp_project_id` → `GCP_PROJECT_ID`
- `firestore_collection_name` → `FIRESTORE_SUBSCRIPTIONS_COLLECTION` (default: 'subscriptions')

## Módulos

### Database Module

Crea una base de datos Firestore en modo `FIRESTORE_NATIVE`.

**Variables:**
- `gcp_project_id`: ID del proyecto GCP
- `region`: Región de GCP (ej: us-central1)
- `environment`: Nombre del ambiente
- `project_name`: Nombre del proyecto

### Storage Module

Crea un bucket de Google Cloud Storage con configuración CORS.

**Características:**
- ✅ CORS configurado para GET, POST, PUT, DELETE
- ✅ Uniform bucket-level access habilitado
- ✅ Labels para organización
- ✅ Lifecycle rules (opcional)

**Variables:**
- `gcp_project_id`: ID del proyecto GCP
- `project_name`: Nombre del proyecto
- `environment`: Nombre del ambiente
- `region`: Región de GCP
- `suffix`: Sufijo para unicidad del nombre
- `allowed_origins`: Lista de orígenes permitidos para CORS

## CORS Configuration

La configuración CORS es **crítica** para:
- ✅ Admin Panel (subida de videos)
- ✅ Signed URLs (reproducción de videos)
- ✅ Requests desde el frontend

**Métodos permitidos:** GET, POST, PUT, DELETE, HEAD

**Headers permitidos:** Content-Type, Authorization, Content-Length, ETag, x-goog-resumable

## Alineación con Código

Los nombres de recursos coinciden con las variables de entorno en `ENV_SETUP.md`:

| Variable de Entorno | Output de Terraform |
|---------------------|---------------------|
| `GCP_PROJECT_ID` | `gcp_project_id` |
| `GCS_BUCKET_NAME` | `gcs_bucket_name` |
| `FIRESTORE_SUBSCRIPTIONS_COLLECTION` | `firestore_collection_name` (default: 'subscriptions') |

## Replicar para Producción

Para crear el ambiente de producción:

1. Copia la estructura de `qa/` a `prod/`
2. Actualiza `terraform.tfvars` con valores de producción
3. Cambia `allowed_origins` a los dominios de producción
4. Ajusta `force_destroy = false` en el módulo de storage

## Seguridad

- ⚠️ **NUNCA** commitees `gcp-service-account.json` o `terraform.tfvars` con datos sensibles
- ✅ El `.gitignore` está configurado para proteger estos archivos
- ✅ Usa secretos en tu CI/CD para variables sensibles

## Troubleshooting

### Error: "Permission denied"
**Solución:** Verifica que la Service Account tenga los roles necesarios.

### Error: "Bucket name already exists"
**Solución:** Los nombres de buckets deben ser únicos globalmente. Cambia el `suffix` en `terraform.tfvars`.

### Error: "Firestore API not enabled"
**Solución:** Habilita la API de Firestore en [Google Cloud Console](https://console.cloud.google.com/apis/library/firestore.googleapis.com).

## Referencias

- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [Cloud Storage CORS](https://cloud.google.com/storage/docs/configuring-cors)
