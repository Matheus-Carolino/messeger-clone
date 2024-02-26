"use client";

import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import { Conversation } from "@prisma/client";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GroupSettingsProps {
    isOpen?: boolean;
    onClose: () => void;
    conversation: Conversation
}

const GroupSettings: React.FC<GroupSettingsProps> = ({
    isOpen,
    onClose,
    conversation
}) => {
    const router = useRouter();
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: conversation?.name,
            groupImage: conversation?.groupImage
        }
    });

    const groupImage = watch('groupImage');

    const handleUpload = (result: any) => {
        setValue('groupImage', result?.info?.secure_url, {
            shouldValidate: true
        })
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post(`/api/conversations/${conversationId}/groupSettings`, data)
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => setIsLoading(false))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="
                            text-base
                            font-semibold
                            leading-7
                            text-gray-900
                        ">
                            Group profile
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Edit your group profile information.
                        </p>

                        <div className="
                            mt-10
                            flex
                            flex-col
                            gap-y-8
                        ">
                            <Input
                                disabled={isLoading}
                                label="Name"
                                id="name"
                                required
                                errors={errors}
                                register={register}
                            />
                            <div>
                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-gray-900
                                ">
                                    Photo
                                </label>
                                <div className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-x-3
                                ">
                                    <Image
                                        width="48"
                                        height="48"
                                        className="rounded-full max-h-12 max-w-12"
                                        src={groupImage || conversation?.groupImage || '/images/placeholder.jpg'}
                                        alt="Avatar"
                                    />
                                    <CldUploadButton
                                        options={{ maxFiles: 1 }}
                                        onUpload={handleUpload}
                                        uploadPreset="qowt8van"
                                    >
                                        <Button
                                            disabled={isLoading}
                                            secondary
                                            type="button"
                                        >
                                            Change
                                        </Button>
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            justify-end
                            gap-x-6
                        "
                    >
                        <Button
                            disabled={isLoading}
                            secondary
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            type="submit"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}

export default GroupSettings;