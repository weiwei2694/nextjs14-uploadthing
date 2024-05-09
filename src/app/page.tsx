'use client';

import Review from '@/components/Review';
import { Progress } from '@/components/ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import { Image, Loader2, MousePointerSquareDashed } from 'lucide-react';
import { useState, useTransition } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';

function Page() {
	const [isDragOver, setIsDragOver] = useState<boolean>(false);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState<boolean | null>(null);
	const [url, setUrl] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [files, setFiles] = useState<File[] | null>(null);

	const { startUpload, isUploading } = useUploadThing('imageUploader', {
		onClientUploadComplete: ([data]) => {
			const urlImg = data.serverData.url;
			startTransition(() => {
				// You can call a function, for example if you want to save it to the database
				// but in this case I save it into state
				setUrl(urlImg);
			});
		},
		onUploadProgress: (p) => {
			setUploadProgress(p);
		},
	});

	const onDropRejected = (rejectedFiles: FileRejection[]) => {
		const [file] = rejectedFiles;
		setIsDragOver(false);

		console.error({
			title: `${file.file.type} type is not suppported.`,
			description: 'Please choose a PNG, JPG, or JPEG image instead.',
			variant: 'destructive',
		});
	};
	const onDropAccepted = (acceptedFiles: File[]) => {
		// startUpload(acceptedFiles);
		// setIsDragOver(false);

		const file: File = acceptedFiles[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
			setIsOpen(true);
			setFiles(acceptedFiles);
		}

		setIsDragOver(false);
	};

	return (
		<>
			<div className='h-full flex items-center justify-center flex-col gap-y-6'>
				<h1 className='relative tracking-tight text-balance font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl text-center'>
					Upload
					<span className='bg-red-600 px-2 text-white'>Thing</span>
				</h1>
				<div className='mx-auto w-full max-w-4xl h-[500px]'>
					<div
						className={cn(
							'relative h-full flex-1 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center',
							{
								'ring-blue-900/25 bg-blue-900/10': isDragOver,
							}
						)}
					>
						<div className='relative flex flex-1 flex-col items-center justify-center w-full'>
							<Dropzone
								onDropRejected={onDropRejected}
								onDropAccepted={onDropAccepted}
								accept={{
									'image/png': ['.png'],
									'image/jpeg': ['.jpeg'],
									'image/jpg': ['.jpg'],
								}}
								onDragEnter={() => setIsDragOver(true)}
								onDragLeave={() => setIsDragOver(false)}
							>
								{({ getRootProps, getInputProps }) => (
									<div
										className='h-full w-full flex-1 flex flex-col items-center justify-center'
										{...getRootProps()}
									>
										<input
											hidden
											{...getInputProps}
										/>
										{isDragOver ? (
											<MousePointerSquareDashed className='h-6 w-6 text-zinc-500 mb-2' />
										) : isUploading || isPending ? (
											<Loader2 className='animate-spin h-6 w-6 text-zinc-500 mb-2' />
										) : (
											<Image className='h-6 w-6 text-zinc-500 mb-2' />
										)}
										<div className='flex flex-col justify-center mb-2 text-sm text-zinc-700'>
											{isUploading ? (
												<div className='flex flex-col items-center'>
													<p>Uploading...</p>
													<Progress
														value={uploadProgress}
														className='mt-2 w-40 h-2 bg-gray-300'
													/>
												</div>
											) : isPending ? (
												<div className='flex flex-col items-center'>
													<p>Please wait...</p>
												</div>
											) : isDragOver ? (
												<p>
													<span className='font-semibold'>
														Drop file
													</span>{' '}
													to upload
												</p>
											) : (
												<p>
													<span className='font-semibold'>
														Click to upload
													</span>{' '}
													or drag and drop
												</p>
											)}
										</div>

										{isPending ? null : (
											<p className='text-xs text-zinc-500'>
												PNG, JPG, JPEG
											</p>
										)}
									</div>
								)}
							</Dropzone>
						</div>
					</div>
				</div>
			</div>

			{isOpen && (
				<Review
					startUpload={startUpload}
					setPreview={setPreview}
					preview={preview}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					isPending={isPending}
					files={files}
				/>
			)}
		</>
	);
}

export default Page;
