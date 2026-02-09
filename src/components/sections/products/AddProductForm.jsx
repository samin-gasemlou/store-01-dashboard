import { useState } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import ImageUploader from "./ImageUploader";
import PriceInput from "./PriceInput";
import DateTimePicker from "./DateTimePicker";

export default function AddProductForm() {
  const [productExpire, setProductExpire] = useState(null);
  const [discountStart, setDiscountStart] = useState(null);
  const [discountEnd, setDiscountEnd] = useState(null);

  const [form, setForm] = useState({
    title: "",
    expiryDate: "",
    code: "",
    prices: { sale: "", wholesale: "", discounted: "", purchase: "" },
    brand: "",
    category: "",
    descriptionEN: "",
    descriptionAR: "",
    descriptionKR: "",
    freeShipping: false,
    shippingIncluded: false,
    image: null,
  });

  const brands = ["Dior", "Chanel", "Gucci", "Prada"];
  const categories = ["make up", "perfume"];

  const handleImageChange = (file) => setForm(prev => ({ ...prev, image: file }));
  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handlePriceChange = (field, value) => setForm(prev => ({ ...prev, prices: { ...prev.prices, [field]: value } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("فرم آماده ارسال:", { ...form, expiryDate: productExpire, discountStart, discountEnd });
    alert("محصول با موفقیت ذخیره شد! (در اینجا فقط ماک دیتا)");
  };

  return (
    <form className="w-full bg-transparent rounded-2xl p-4 sm:p-6" onSubmit={handleSubmit}>

      {/* ROW 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <TextInput label=":عنوان محصول" value={form.title} onChange={(v) => handleChange("title", v)} />

        <div className="flex flex-col gap-4 sm:gap-6 py-4">
          <label className="text-xs sm:text-sm font-medium lg:text-right text-right md:text-center">:ارسال محصول</label>
          <div className="flex flex-col sm:flex-row md:items-start items-end sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.shippingIncluded} onChange={(e) => handleChange("shippingIncluded", e.target.checked)} />
              شامل هزینه ارسال
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.freeShipping} onChange={(e) => handleChange("freeShipping", e.target.checked)} />
              رایگان است
            </label>
          </div>
        </div>

        <DateTimePicker label=":تاریخ انقضا محصول" value={productExpire} onChange={setProductExpire} />
        <TextInput label=":کد محصول" value={form.code} onChange={(v) => handleChange("code", v)} />
      </div>

      {/* ROW 2 */}
      <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6 mb-4 sm:mb-6">
        <ImageUploader value={form.image} onChange={handleImageChange} />

        <div className="flex-1 flex flex-col gap-4">
          {/* PRICES */}
          <div className="flex flex-col lg:flex-row sm:items-center justify-between w-full gap-2">
            <PriceInput label=":قیمت فروش (تخفیف خورده)" value={form.prices.discounted} onChange={(v) => handlePriceChange("discounted", v)} />
            <PriceInput label=":قیمت عمده" value={form.prices.wholesale} onChange={(v) => handlePriceChange("wholesale", v)} />
            <PriceInput label=":قیمت فروش" value={form.prices.sale} onChange={(v) => handlePriceChange("sale", v)} />
            <PriceInput label=":قیمت خرید" value={form.prices.purchase} onChange={(v) => handlePriceChange("purchase", v)} />
          </div>

          {/* DISCOUNT + BRAND + CATEGORY */}
          <div className="flex flex-col lg:flex-row md:items-center lg:justify-end justify-center w-full gap-2">
            <div className="flex flex-col items-center justify-center">
              <DateTimePicker label=":شروع تخفیف" value={discountStart} onChange={setDiscountStart} />
            <DateTimePicker label=":پایان تخفیف" value={discountEnd} onChange={setDiscountEnd} />
            </div>
            <div className="flex flex-col items-center justify-center">

            <SelectInput label=":برند" value={form.brand} options={brands} onChange={(v) => handleChange("brand", v)} />
            <SelectInput label=":دسته بندی" value={form.category} options={categories} onChange={(v) => handleChange("category", v)} />
              </div>
          </div>
        </div>
      </div>

      {/* TEXTS */}
      <div className="space-y-4 sm:space-y-6">
        <TextArea label=":توضیحات به انگلیسی" value={form.descriptionEN} onChange={(v) => handleChange("descriptionEN", v)} />
        <TextArea label=":توضیحات به عربی" value={form.descriptionAR} onChange={(v) => handleChange("descriptionAR", v)} />
        <TextArea label=":توضیحات به کردی" value={form.descriptionKR} onChange={(v) => handleChange("descriptionKR", v)} />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-8">
        <button type="button" onClick={() => {
          setForm({
            title: "",
            expiryDate: "",
            code: "",
            prices: { sale: "", wholesale: "", discounted: "", purchase: "" },
            brand: "",
            category: "",
            descriptionEN: "",
            descriptionAR: "",
            descriptionKR: "",
            freeShipping: false,
            shippingIncluded: false,
            image: null,
          });
          setProductExpire(null);
          setDiscountStart(null);
          setDiscountEnd(null);
        }} className="px-6 sm:px-8 py-2 rounded-lg font-bold bg-gray-400 text-white text-xs sm:text-[10px]">
          حذف
        </button>
        <button type="submit" className="px-6 sm:px-8 py-2 rounded-lg font-bold bg-[#2B4168] text-white text-xs sm:text-[10px]">
          ذخیره
        </button>
      </div>
    </form>
  );
}
