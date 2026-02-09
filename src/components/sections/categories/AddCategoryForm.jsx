import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import ImageUploader from "./ImageUploader";

export default function AddCategoryForm() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      <h2 className="text-right text-[#273959] font-bold text-[18px] sm:text-[20px]">
        اضافه کردن دسته بندی
      </h2>

      <TextInput label=":نام اصلی (انگلیسی)" value="Various Products" />
      <TextInput label=":نام عربی" value="منتجات متنوعة" />
      <TextInput label=":نام کردی" value="به‌رهه‌مه‌ هه‌روزه‌کان" />
      <SelectInput label=":دسته بندی مادر" value="بهداشتی" />
      <ImageUploader label=":تصویر دسته بندی" />

    </div>
  );
}
