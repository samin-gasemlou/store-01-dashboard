import React from 'react';
import BaseModal from '../ui/BaseModal';
import { ChevronDown } from 'lucide-react';

const EditBrandModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="ویرایش برند" size="md">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left: Image Upload (In RTL displays on Left visually if flex-row used correctly) */}
        {/* نکته: در فلکس باکس با دایرکشن راست‌چین، اولین المنت سمت راست است. پس اینپوت‌ها اول می‌آیند */}
        
        <div className="flex-1 w-full space-y-4 order-2 md:order-1">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">نام اصلی (انگلیسی)</label>
            <input 
              type="text" 
              defaultValue="Various Products"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-left"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">برند مادر:</label>
            <div className="relative">
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 appearance-none bg-white">
                    <option>بهداشتی</option>
                    <option>آرایشی</option>
                </select>
                <ChevronDown className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 order-1 md:order-2">
            <label className="text-sm font-semibold text-slate-700">تصویر برند:</label>
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-center bg-white h-40">
                <img src="/path-to-perfume.png" alt="Brand" className="h-full object-contain" />
            </div>
        </div>
      </div>

       <div className="flex justify-start gap-4 pt-8">
          <button className="px-8 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900">ذخیره</button>
          <button className="px-8 py-2.5 bg-slate-400 text-white rounded-lg hover:bg-slate-500">حذف</button>
      </div>
    </BaseModal>
  );
};

export default EditBrandModal;