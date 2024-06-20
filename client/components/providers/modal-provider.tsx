"use client";

import {SettingsModal} from "@/components/modals/settings-modal";
import { FileModal } from "../modals/file-modal";
import {useEffect, useState} from "react";
import {useFile} from "@/hooks/use-file";


export const ModalProvider = () => {
    const file = useFile();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SettingsModal/>
            <FileModal/>
        </>
    );
};
