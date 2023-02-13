import Swal from 'sweetalert2'

const Modal = () => {
  const DefaultToast = Swal.mixin({
    toast: false,
    showConfirmButton: false,
    timer: 1000,

    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  function showSuccess(title: string, message?: string) {
    DefaultToast.fire({
      icon: 'success',
      titleText: title,
      text: message
    })
  }

  function showError(title: string, message?: string) {
    DefaultToast.fire({
      icon: 'error',
      titleText: title,
      text: message
    })
  }

  return {
    showSuccess,
    showError
  }
}

export default Modal()
