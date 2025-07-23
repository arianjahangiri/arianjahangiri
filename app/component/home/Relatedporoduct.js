import React from 'react';

const Relatedporoduct = () => {
    return (
        <section className="mb-4">
        <section className="container-xxl" >
            <section className="row">
                <section className="col">
                    <section className="content-wrapper bg-white p-3 rounded-2">
                        {/* <!-- start vontent header --> */}
                        <section className="content-header">
                            <section className="d-flex justify-content-between align-items-center">
                                <h2 className="content-header-title">
                                    <span>کالاهای مرتبط</span>
                                </h2>
                                <section className="content-header-link">
                                    {/* <!--<a href="#">مشاهده همه</a>--> */}
                                </section>
                            </section>
                        </section>
                        {/* <!-- start vontent header --> */}
                        <section className="lazyload-wrapper" >
                            <section className="lazyload light-owl-nav owl-carousel owl-theme">

                                <section className="item">
                                    <section className="lazyload-item-wrapper">
                                        <section className="product">
                                            <section className="product-add-to-cart"><a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به سبد خرید"><i className="fa fa-cart-plus"></i></a></section>
                                            <section className="product-add-to-favorite"><a href="#" data-bs-toggle="tooltip" data-bs-placement="left" title="افزودن به علاقه مندی"><i className="fa fa-heart"></i></a></section>
                                            <a className="product-link" href="#">
                                                <section className="product-image">
                                                    <img className="" src="assets/images/products/3.jpg" alt=""/>
                                                </section>
                                                <section className="product-name"><h3>پکیج آموزش خطاطی و خوشنویسی با کد 624</h3></section>
                                                <section className="product-price-wrapper">
                                                    <section className="product-price">115,000 تومان</section>
                                                </section>
                                                <section className="product-colors">
                                                    <section className="product-colors-item" style={{backgroundColor: "yellow"}}></section>
                                                    <section className="product-colors-item" style={{backgroundColor: "green"}}></section>
                                                    <section className="product-colors-item" style={{backgroundColor: "white"}}></section>
                                                    <section className="product-colors-item" style={{backgroundColor: "blue"}}></section>
                                                    <section className="product-colors-item" style={{backgroundColor: "red"}}></section>
                                                </section>
                                            </a>
                                        </section>
                                    </section>
                                </section>
                          
                                </section>

                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </section>
    // {/* </section> */}
    // </div>
    );
};

export default Relatedporoduct;