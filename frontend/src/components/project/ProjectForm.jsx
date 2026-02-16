import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import { STATUS_OPTIONS } from '../../utils/constants';
import { formatDateForInput } from '../../utils/dateFormatter';

export default function ProjectForm({ initialData, onSubmit, onCancel, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      clientName: initialData?.clientName || '',
      status: initialData?.status || 'ON_HOLD',
      startDate: formatDateForInput(initialData?.startDate) || '',
      endDate: formatDateForInput(initialData?.endDate) || '',
    },
  });

  const startDate = watch('startDate');

  const submitHandler = (data) => {
    const cleaned = { ...data };
    if (!cleaned.startDate) delete cleaned.startDate;
    if (!cleaned.endDate) delete cleaned.endDate;
    onSubmit(cleaned);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name', {
            required: 'Name is required',
            maxLength: { value: 200, message: 'Must be 200 characters or less' },
          })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
          Client Name <span className="text-red-500">*</span>
        </label>
        <input
          id="clientName"
          type="text"
          {...register('clientName', {
            required: 'Client name is required',
            maxLength: { value: 200, message: 'Must be 200 characters or less' },
          })}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            errors.clientName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.clientName && (
          <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            {...register('startDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            {...register('endDate', {
              validate: (value) => {
                if (value && !startDate) return 'Start date is required when end date is set';
                if (value && startDate && new Date(value) <= new Date(startDate))
                  return 'End date must be after start date';
                return true;
              },
            })}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
