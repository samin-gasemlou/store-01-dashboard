import React from 'react';
import BaseModal from '../ui/BaseModal';
import { ChevronDown } from 'lucide-react';

const EditCategoryModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="ویرایش دسته بندی" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Inputs Column 1 */}
        <div className="space-y-2 flex flex-col items-start justify-center gap-2">
            <label className="text-sm font-semibold text-slate-700">نام اصلی (انگلیسی)</label>
            <input type="text" defaultValue="Various Products" className="w-full p-3 border border-gray-300 rounded-lg text-left" />
        </div>
         <div className="space-y-2 flex flex-col items-start justify-center gap-2">
            <label className="text-sm font-semibold text-slate-700">نام عربی</label>
            <input type="text" defaultValue="منتجات المتنوعة" className="w-full p-3 border border-gray-300 rounded-lg text-right" />
        </div>

        {/* Inputs Column 2 */}
        <div className="space-y-2 w-full flex flex-col items-start justify-center gap-2">
            <label className="text-sm font-semibold text-slate-700">نام کوردی:</label>
            <input type="text" defaultValue="به‌رهه‌مه جۆراوجۆره‌کان" className="w-full p-3 border border-gray-300 rounded-lg text-right" />
        </div>
         <div className="space-y-2 flex flex-col items-start justify-center gap-2">
            <label className="text-sm font-semibold text-slate-700">دسته بندی مادر:</label>
             <div className="relative w-full">
                <select className="w-full px-2 py-2 border border-gray-300 rounded-lg appearance-none bg-white">
                    <option>بهداشتی</option>
                    <option>بهداشتی</option>
                    <option>بهداشتی</option>
                </select>
                <ChevronDown className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>

        {/* Image Section - Spanning or separate */}
        <div className="md:col-span-2 flex  justify-start items-end gap-4 mt-2">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">تصویر دسته بندی:</label>
                <div className="w-24 h-24 border rounded-lg p-2 flex items-center justify-center bg-white">
                    <img src="/path-to-image.png" className="max-h-full" alt="cat" />
                </div>
            </div>
        </div>

      </div>

      <div className="flex gap-4 mt-6 justify-center md:justify-end">
          <button className="px-8 py-2.5 bg-slate-800 text-white rounded-lg">ذخیره</button>
          <button className="px-8 py-2.5 bg-slate-400 text-white rounded-lg">حذف</button>
      </div>
    </BaseModal>
  );
};

export default EditCategoryModal;