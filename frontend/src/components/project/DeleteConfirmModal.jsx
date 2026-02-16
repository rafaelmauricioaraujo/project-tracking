import Modal from '../common/Modal';
import Button from '../common/Button';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, projectName, isDeleting }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project?" size="sm">
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete &lsquo;{projectName}&rsquo;? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}
