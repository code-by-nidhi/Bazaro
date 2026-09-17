import Swal from 'sweetalert2';

const brandSwal = Swal.mixin({
  confirmButtonColor: '#4f46e5',
  cancelButtonColor: '#64748b',
});

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

export const showSuccess = (title, text = '') =>
  brandSwal.fire({ icon: 'success', title, text, timer: 2000, timerProgressBar: true, showConfirmButton: false });

export const showError = (title, text = '') => brandSwal.fire({ icon: 'error', title, text });

export const showValidationErrors = (errors) =>
  brandSwal.fire({
    icon: 'error',
    title: 'Please fix the following',
    html: `<ul style="text-align:left;margin:0;padding-left:1.2rem;list-style:disc;font-size:14px;line-height:1.6">${errors
      .map((err) => `<li>${escapeHtml(err)}</li>`)
      .join('')}</ul>`,
  });

export const confirmAction = async ({ title, text = '', confirmButtonText = 'Yes, continue' }) => {
  const result = await brandSwal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    confirmButtonColor: '#dc2626',
  });
  return result.isConfirmed;
};

// Pulls the most useful message out of an axios/JS error.
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.message || error?.message || fallback;
