import { useHttpDelete } from '@/hooks/api'
import Swal from 'sweetalert2'

const Toast = () => {
  const DefaultToast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: true
  })
  function showDelete(url: string) {
    swalWithBootstrapButtons
      .fire({
        title: 'Você tem certeza que deseja excluir?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir registro!',
        cancelButtonText: 'Não, cancelar',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await useHttpDelete({
              url
            })
            //     if (!response.ok) {
            //       return Swal.showValidationMessage(`
            //   ${JSON.stringify(response)}
            // `)
            //     }
            return response
          } catch (error) {
            Swal.showValidationMessage(`
        Request failed: ${error}
      `)
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: 'Excluido com Sucesso!',
            text: '',
            icon: 'success',
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            timer: 3000
          })
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado com sucesso',
            text: '',
            icon: 'error',
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            timer: 3000
          })
        }
      })
  }

  function showSuccess(message: string) {
    DefaultToast.fire({
      icon: 'success',
      title: message
    })
  }

  function showError(message: string) {
    DefaultToast.fire({
      icon: 'error',
      title: message
    })
  }

  function showInfo(message: string) {
    DefaultToast.fire({
      icon: 'info',
      title: message
    })
  }

  return {
    showSuccess,
    showError,
    showDelete,
    showInfo
  }
}

export default Toast()
