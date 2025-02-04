'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useOnboarding } from './OnboardingContext'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  goals: z.string().min(10, 'Please describe your goals in at least 10 characters'),
})

export function GoalsStep() {
  const { formData, setFormValue, prevStep, submitForm } = useOnboarding()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: formData.goals,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormValue('goals', values.goals)
    await submitForm()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are your goals with Levery?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I want to stay informed about AI developments and create content that..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">Complete Setup</Button>
        </div>
      </form>
    </Form>
  )
}
