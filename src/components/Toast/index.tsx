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

  return {
    showSuccess,
    showError
  }
}

export default Toast()
