// dashboard/src/components/sections/products/AddProductForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SelectInput from "./SelectInput";
import ImageUploader from "./ImageUploader";
import PriceInput from "./PriceInput";
import DateTimePicker from "./DateTimePicker";

import {
  createProduct,
  updateProduct,
  fetchProductById,
} from "../../../services/products.service.js";

function toISOorEmpty(d) {
  if (!d) return "";
  try {
    const dt = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toISOString();
  } catch {
    return "";
  }
}

function pickFirst(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return "";
}

function safeDateOrNull(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function mapBackendToForm(raw) {
  const p = raw || {};

  // بک شما می‌گه name_en و categoryName required هست
  const name_en = pickFirst(p.name_en, p.nameEn, p.title_en, p.enName, "");
  const categoryName = pickFirst(p.categoryName, p.category_name, p.category, "");

  // برای نمایش در UI
  const title = pickFirst(p.title, p.name_fa, p.name, "");
  const code = pickFirst(p.code, p.sku, p.productCode, "");

  const expiryDate = pickFirst(p.expiryDate, p.expireDate, p.expiresAt);
  const discountStart = pickFirst(p.discountStart, p.discountStartAt, p.discountFrom);
  const discountEnd = pickFirst(p.discountEnd, p.discountEndAt, p.discountTo);

  const sale = pickFirst(p.price, p.salePrice, p.prices?.sale, "");
  const purchase = pickFirst(p.costPrice, p.purchasePrice, p.buyPrice, p.prices?.purchase, "");

  const wholesale = pickFirst(p.wholesalePrice, p.prices?.wholesale, "");
  const discounted = pickFirst(p.discountPrice, p.discountedPrice, p.prices?.discounted, "");

  const brand = pickFirst(p.brand?._id, p.brandId, p.brand, "");

  const descriptionEN = pickFirst(p.descriptionEN, p.description_en, p.desc_en, "");
  const descriptionAR = pickFirst(p.descriptionAR, p.description_ar, p.desc_ar, "");
  const descriptionKR = pickFirst(p.descriptionKR, p.description_kr, p.desc_kr, "");

  const freeShipping = Boolean(p.freeShipping ?? p.isFreeShipping ?? false);
  const shippingIncluded = Boolean(p.shippingIncluded ?? p.isShippingIncluded ?? false);

  // بک گفته mainImage required
  const mainImage = pickFirst(p.mainImage, p.image, p.thumbnail, null);

  return {
    form: {
      title: title || "",
      name_en: name_en || "",
      code: code || "",
      categoryName: categoryName || "",
      brand: brand || "",
      prices: {
        sale: sale !== "" && sale != null ? String(sale) : "",
        wholesale: wholesale !== "" && wholesale != null ? String(wholesale) : "",
        discounted: discounted !== "" && discounted != null ? String(discounted) : "",
        purchase: purchase !== "" && purchase != null ? String(purchase) : "",
      },
      descriptionEN,
      descriptionAR,
      descriptionKR,
      freeShipping,
      shippingIncluded,
      mainImage,
    },
    productExpire: safeDateOrNull(expiryDate),
    discountStart: safeDateOrNull(discountStart),
    discountEnd: safeDateOrNull(discountEnd),
  };
}

/**
 * ✅ بک شما required ها رو می‌خواد: name_en, categoryName, costPrice, price, mainImage
 * ✅ پس همیشه FormData می‌فرستیم
 */
function buildFormData({ form, productExpire, discountStart, discountEnd, isEdit }) {
  const fd = new FormData();

  // ---------- REQUIRED ----------
  fd.append("name_en", form.name_en || "");
  fd.append("categoryName", form.categoryName || "");

  // price / costPrice
  const price = form.prices?.sale !== "" ? Number(form.prices.sale) : "";
  const costPrice = form.prices?.purchase !== "" ? Number(form.prices.purchase) : "";

  fd.append("price", String(price));
  fd.append("costPrice", String(costPrice));

  // mainImage
  // نکته: در update بعضی بک‌ها اجازه میدن عکس ارسال نشه.
  // ولی چون شما required اعلام شده، ما برای create حتما می‌فرستیم.
  if (form.mainImage instanceof File) {
    fd.append("mainImage", form.mainImage);
  } else if (typeof form.mainImage === "string" && form.mainImage) {
    // فقط اگر بک URL رو قبول کند
    fd.append("mainImage", form.mainImage);
  } else {
    if (!isEdit) {
      // create => required
      fd.append("mainImage", "");
    }
    // update => می‌تونیم نفرستیم تا عکس قبلی بماند
  }

  // ---------- OPTIONAL / HELPFUL ----------
  if (form.title) fd.append("title", form.title);
  if (form.code) fd.append("code", form.code);
  if (form.brand) fd.append("brand", String(form.brand));

  fd.append("freeShipping", String(!!form.freeShipping));
  fd.append("shippingIncluded", String(!!form.shippingIncluded));

  const expiryISO = toISOorEmpty(productExpire);
  if (expiryISO) fd.append("expiryDate", expiryISO);

  const ds = toISOorEmpty(discountStart);
  if (ds) fd.append("discountStart", ds);

  const de = toISOorEmpty(discountEnd);
  if (de) fd.append("discountEnd", de);

  if (form.descriptionEN) fd.append("descriptionEN", form.descriptionEN);
  if (form.descriptionAR) fd.append("descriptionAR", form.descriptionAR);
  if (form.descriptionKR) fd.append("descriptionKR", form.descriptionKR);

  // فیلدهای اضافه (اگر بعداً خواستی)
  // if (form.prices?.wholesale !== "") fd.append("wholesalePrice", String(Number(form.prices.wholesale)));
  // if (form.prices?.discounted !== "") fd.append("discountPrice", String(Number(form.prices.discounted)));

  return fd;
}

export default function AddProductForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const isEdit = useMemo(
    () => state?.mode === "edit" || !!state?.productId || !!state?.product?.id || !!state?.product?._id,
    [state]
  );

  const editingId = useMemo(
    () => state?.productId || state?.product?.id || state?.product?._id,
    [state]
  );

  const [productExpire, setProductExpire] = useState(null);
  const [discountStart, setDiscountStart] = useState(null);
  const [discountEnd, setDiscountEnd] = useState(null);

  const [form, setForm] = useState({
    title: "",
    name_en: "",
    code: "",
    categoryName: "",
    brand: "",
    prices: { sale: "", wholesale: "", discounted: "", purchase: "" },
    descriptionEN: "",
    descriptionAR: "",
    descriptionKR: "",
    freeShipping: false,
    shippingIncluded: false,
    mainImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState(null);

  // فعلاً mock ها
  const brands = ["Dior", "Chanel", "Gucci", "Prada"];
  const categories = ["make up", "perfume"];

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePriceChange = (field, value) =>
    setForm((prev) => ({ ...prev, prices: { ...prev.prices, [field]: value } }));

  // ✅ Prefill برای Edit
  useEffect(() => {
    let alive = true;

    const hydrate = async () => {
      if (!isEdit) {
        setInitialSnapshot(null);
        return;
      }

      try {
        setLoading(true);

        const rawFromState = state?.product?.__raw || state?.product || null;

        if (rawFromState) {
          const mapped = mapBackendToForm(rawFromState);
          if (!alive) return;

          setForm(mapped.form);
          setProductExpire(mapped.productExpire);
          setDiscountStart(mapped.discountStart);
          setDiscountEnd(mapped.discountEnd);
          setInitialSnapshot(mapped);
          return;
        }

        if (editingId) {
          const res = await fetchProductById(editingId);
          const raw = res?.data || res;

          const mapped = mapBackendToForm(raw);
          if (!alive) return;

          setForm(mapped.form);
          setProductExpire(mapped.productExpire);
          setDiscountStart(mapped.discountStart);
          setDiscountEnd(mapped.discountEnd);
          setInitialSnapshot(mapped);
        }
      } catch (e) {
        console.error("prefill edit failed:", e);
        alert(e?.message || "خطا در دریافت اطلاعات محصول برای ویرایش");
      } finally {
        if (alive) setLoading(false);
      }
    };

    hydrate();
    return () => {
      alive = false;
    };
  }, [isEdit, editingId, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ required ها رو همیشه می‌فرستیم
      const payload = buildFormData({
        form,
        productExpire,
        discountStart,
        discountEnd,
        isEdit,
      });

      if (isEdit && editingId) {
        await updateProduct(editingId, payload);
        alert("محصول با موفقیت ویرایش شد!");
      } else {
        await createProduct(payload);
        alert("محصول با موفقیت ذخیره شد!");
      }

      // ✅ برگرد به محصولات + refresh (اگر Products.jsx این state رو listen کنه عالیه)
      navigate("/products", { replace: true, state: { refresh: Date.now() } });
    } catch (err) {
      console.error("save product failed:", err);
      alert(err?.message || "خطا در ذخیره محصول");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    if (isEdit && initialSnapshot) {
      setForm(initialSnapshot.form);
      setProductExpire(initialSnapshot.productExpire);
      setDiscountStart(initialSnapshot.discountStart);
      setDiscountEnd(initialSnapshot.discountEnd);
      return;
    }

    setForm({
      title: "",
      name_en: "",
      code: "",
      categoryName: "",
      brand: "",
      prices: { sale: "", wholesale: "", discounted: "", purchase: "" },
      descriptionEN: "",
      descriptionAR: "",
      descriptionKR: "",
      freeShipping: false,
      shippingIncluded: false,
      mainImage: null,
    });

    setProductExpire(null);
    setDiscountStart(null);
    setDiscountEnd(null);
  };

  return (
    <form className="w-full bg-transparent rounded-2xl p-4 sm:p-6" onSubmit={handleSubmit}>
      {/* ROW 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <TextInput
          label=":نام انگلیسی (required)"
          value={form.name_en}
          onChange={(v) => handleChange("name_en", v)}
        />

        <div className="flex flex-col gap-4 sm:gap-6 py-4">
          <label className="text-xs sm:text-sm font-medium lg:text-right text-right md:text-center">
            :ارسال محصول
          </label>
          <div className="flex flex-col sm:flex-row md:items-start items-end sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.shippingIncluded}
                onChange={(e) => handleChange("shippingIncluded", e.target.checked)}
              />
              شامل هزینه ارسال
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.freeShipping}
                onChange={(e) => handleChange("freeShipping", e.target.checked)}
              />
              رایگان است
            </label>
          </div>
        </div>

        <DateTimePicker label=":تاریخ انقضا محصول" value={productExpire} onChange={setProductExpire} />
        <TextInput label=":کد محصول" value={form.code} onChange={(v) => handleChange("code", v)} />
      </div>

      {/* ROW 2 */}
      <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="w-full lg:w-[28%]">
          <ImageUploader
            value={form.mainImage}
            onChange={(v) => handleChange("mainImage", v)}
          />
        </div>

        <div className="w-full lg:w-[72%] flex flex-col gap-4 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            <PriceInput
              label=":قیمت فروش"
              value={form.prices.sale}
              onChange={(v) => handlePriceChange("sale", v)}
            />
            <PriceInput
              label=":قیمت خرید (costPrice required)"
              value={form.prices.purchase}
              onChange={(v) => handlePriceChange("purchase", v)}
            />
            <PriceInput
              label=":قیمت عمده"
              value={form.prices.wholesale}
              onChange={(v) => handlePriceChange("wholesale", v)}
            />
            <PriceInput
              label=":قیمت تخفیف"
              value={form.prices.discounted}
              onChange={(v) => handlePriceChange("discounted", v)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <DateTimePicker label=":شروع تخفیف" value={discountStart} onChange={setDiscountStart} />
              <DateTimePicker label=":پایان تخفیف" value={discountEnd} onChange={setDiscountEnd} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <SelectInput
                label=":برند"
                value={form.brand}
                options={brands}
                onChange={(v) => handleChange("brand", v)}
              />

              <SelectInput
                label=":دسته بندی (required)"
                value={form.categoryName}
                options={categories}
                onChange={(v) => handleChange("categoryName", v)}
              />
            </div>
          </div>

          {/* optional UI fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <TextInput
              label=":عنوان (اختیاری)"
              value={form.title}
              onChange={(v) => handleChange("title", v)}
            />
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
        <button
          type="button"
          onClick={onReset}
          className="px-6 sm:px-8 py-2 rounded-lg font-bold bg-gray-400 text-white text-xs sm:text-[10px]"
        >
          حذف
        </button>

        <button
          disabled={loading}
          type="submit"
          className="px-6 sm:px-8 py-2 rounded-lg font-bold bg-[#2B4168] text-white text-xs sm:text-[10px]"
        >
          {loading ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>
    </form>
  );
}
