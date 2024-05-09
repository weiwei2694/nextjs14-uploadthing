import type { SetStateAction, Dispatch } from 'react';
import type { ClientUploadedFileData } from 'uploadthing/types';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

type ReviewProps = {
	startUpload: (
		files: File[],
		input?: undefined
	) => Promise<
		| ClientUploadedFileData<{
				url: string;
		  }>[]
		| undefined
	>;
	setPreview: Dispatch<SetStateAction<string | null>>;
	preview: string | null | undefined;
	isOpen: boolean | null | undefined;
	setIsOpen: Dispatch<SetStateAction<boolean | null>>;
	isPending: boolean;
	files: File[] | null;
};

const Review = ({
	startUpload,
	setPreview,
	preview,
	isOpen,
	setIsOpen,
	isPending,
	files,
}: ReviewProps) => {
	const onOpenChange = () => {
		setIsOpen(false);
		setPreview(null);
	};

	return (
		<Dialog
			open={isOpen as boolean}
			onOpenChange={onOpenChange}
		>
			<DialogContent>
				<DialogHeader className='flex gap-4'>
					<DialogTitle>Preview</DialogTitle>
					<div className='p-2'>
						<img
							src={preview!}
							alt='preview img'
							className='w-full h-full object-cover rounded-md'
						/>
					</div>
					<div className='flex justify-end gap-4'>
						<Button
							disabled={isPending}
							variant='outline'
						>
							Cancel
						</Button>
						<Button
							disabled={isPending}
							className='grid place-items-center'
							onClick={() => {
								// Just satisfy the typescript, with "!", because we know that this files has data
								startUpload(files!);
								setIsOpen(false);
								setPreview(null);
							}}
						>
							{isPending ? (
								<Loader2 className='animate-spin h-6 w-6 text-zinc-500 mb-2' />
							) : (
								'Upload'
							)}
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default Review;
