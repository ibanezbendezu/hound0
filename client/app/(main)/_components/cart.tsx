"use client";

import {cn} from "@/lib/utils";
import {
    ChevronsRight,
    SquareSlash,
    Code,
    SquareX
} from "lucide-react";
import {useParams, usePathname, useRouter} from "next/navigation";
import {ElementRef, useEffect, useRef, useState} from "react";
import {useMediaQuery} from "usehooks-ts";
import {toast} from "sonner";

import useCart from './../../../store/repos';
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";


export const Cart = () => {

    const cartItems = useCart(state => state.cart)
    const emptyCart = useCart(state => state.emptyCart)

    async function checkout() {
        const lineItems = cartItems.map(cartItem => {
            console.log('CART ITEM: ', cartItem)
            return {
                price: cartItem.price_id,
                quantity: 1
            }
        })
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lineItems })
        })
        const data = await res.json()
        router.push(data.session.url)
    }

    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)"); // mobile screen size break point

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        collapse();
    }, []);

    const handleRepos = () => {
        emptyCart();
    }

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    // to handle resizing the sidebar
    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return; // if isResizingRef is false, break the function
        let newWidth = event.clientX; // get the width

        if (newWidth < 240) newWidth = 240; // minimum width limit
        if (newWidth > 480) newWidth = 480; // maximum width limit

        // if sidebarRef is active
        if (sidebarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`; // set the sidebar width
        }
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    // reset the sidebar width to its original width
    const resetWidth = () => {
        if (sidebarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    // handle the collapsing of the sidebar
    const collapse = () => {
        if (sidebarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                {/* To collapse the sidebar */}
                <div
                    role="button"
                    onClick={collapse}
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 left-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsRight className="h-6 w-6"/>
                </div>
                <div>
                    <div className="flex justify-end">
                        <div className="text-sm font-medium px-3 py-3 gap-2 flex items-center">
                            <span>Repositorios</span>
                            <SquareSlash className="h-5 w-5"/>
                        </div>
                        
                    </div>
                    
                    <ConfirmModal onConfirm={() => handleRepos()}>
                        <div className="flex justify-center px-4 py-4" style={{ pointerEvents: cartItems.length === 0 ? 'none' : 'auto' }}>
                            <Button disabled={cartItems.length === 0} className="h-6 w-full">
                                Comparar
                            </Button>
                        </div>
                    </ConfirmModal>

                    {cartItems.length === 0 ? (
                        <div className="flex h-full justify-center">
                            <p className="text-muted-foreground text-sm whitespace-nowrap">
                                No hay repositorios
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-start">
                            {cartItems.map((item, index) => (
                                <div key={index} className="mx-3 gap-2 min-h-[27px] text-sm flex items-center text-muted-foreground font-medium">
                                    <Code className="shrink-0 h-[18px] w-[18px]" />
                                    <span className="overflow-hidden whitespace-nowrap"> {item.owner.login + "/" + item.name} </span>
                                    <SquareX className="ml-auto shrink-0 h-[18px] w-[18px] items-end cursor-pointer"
                                        onClick={() => {
                                            useCart.getState().removeItemFromCart({ itemIndex: index });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* To resize the sidebar */}
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
            
            {/* Button to open the sidebar when it's collapsed */}
            {isCollapsed && (
                <div
                    role="button"
                    onClick={resetWidth}
                    className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 absolute top-3 right-6"
                >
                    {cartItems.length > 0 && (
                        <div className='absolute aspect-square pointer-events-none h-5 w-5 sm:h-5 grid place-items-center top-0 bg-red-400 text-white rounded-sm right-0 -translate-x-8 translate-y-0.5' >
                            <p className='text-xs sm:text-xs'>{cartItems.length}</p>
                        </div>
                    )}
                    <SquareSlash className="h-6 w-6"/>
                </div>
            )}
        </>
    );
};
